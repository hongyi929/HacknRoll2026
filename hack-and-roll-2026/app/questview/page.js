"use client";
import { useEffect, useState, Suspense } from "react";
import { GoogleGenAI } from "@google/genai";
import { db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Header from "@/components/Header";
import Dropdown from "@/components/Dropdown";
import { useRouter, useSearchParams } from "next/navigation";

function QuestViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [waypointData, setWaypointData] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [questStatuses, setQuestStatuses] = useState({
    quest1: null,
    quest2: null,
    quest3: null,
  });
  
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  useEffect(() => {
    if (!searchParams) return;

    const name = searchParams.get("name") || "Unknown Location";
    const lat = searchParams.get("lat") || "1.2966";
    const lng = searchParams.get("lng") || "103.7764";
    const key = searchParams.get("key") || "unknown";
    
    console.log("URL Params:", { name, lat, lng, key });
    
    const waypointInfo = { name, lat, lng, key };
    setWaypointData(waypointInfo);
    generateQuests(parseFloat(lat), parseFloat(lng));
    setIsReady(true);
  }, [searchParams]);

  // ADD THIS NEW useEffect - Watch for when all quests are completed
  useEffect(() => {
    const allQuestsDone = questStatuses.quest1 !== null && questStatuses.quest2 !== null && questStatuses.quest3 !== null;
    
    if (!allQuestsDone) return; // Don't check until all are done
    
    const allQuestsPassed = questStatuses.quest1 && questStatuses.quest2 && questStatuses.quest3;
    
    if (allQuestsPassed) {
      console.log("All quests passed! Marking as complete.");
      markWaypointComplete();
    } else {
      console.log("Some quests failed. Showing try again popup.");
      setPopupType("tryAgain");
      setShowPopup(true);
    }
  }, [questStatuses]);

  async function verifyPhoto(questName, image, questNo) {
    console.log("=== VERIFY PHOTO DEBUG ===");
    console.log("waypointData:", waypointData);
    console.log("questName:", questName);
    console.log("questNo:", questNo);
    console.log("======");

    const base64ImageData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(image);
    });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64ImageData,
          },
        },
        {
          text: `Score the image from 0 to 100. 60 and above is a pass. Quest: ${questName}. Longitude: ${waypointData.lng}, Latitude: ${waypointData.lat}`,
        },
      ],
      config: {
        systemInstruction:
          "You are a geographical expert and evaluator of geographical environments. When the image is sent back to you with the quest prompt, you need to evaluate the location assigned to them and whether the image is accurate in the location and in matching the quest prompt, scoring between 1 to 100 based on accuracy to location and quest. Your first line should be formatted as such: Score,Reasoning(output does not continue here. score is a number. example output: 32,followedbyreasoning, which should be no less than 3 lines explaining why the user did not score higher if the score is below 80, and a 1 line congrats if it scored 80 and above. You must explain the bad so the user can fix the image to be more appropriate. Avoid all use of commas in the reasoning sentence. Focus on being succinct yet informative. No more than 35 words. Link the reasoning given to the prompt and location.) Do NOT make assumptions about location type (hub, park, etc). Focus purely on: does the image show what the quest asks?",
      },
    });
    
    const responseText = result.text;
    const score = parseInt(responseText.split(",")[0]);
    
    console.log(`Quest ${questNo} score: ${score}`);
    
    // Update quest status based on score
    const questKey = `quest${questNo}`;
    setQuestStatuses(prev => ({
      ...prev,
      [questKey]: score >= 60
    }));
    
    return responseText;
  }

  async function markWaypointComplete() {
    try {
      const docRef = doc(db, "miniWaypoint", waypointData.key);
      
      await setDoc(
        docRef,
        {
          completed: true,
          completedAt: new Date(),
        },
        { merge: true }
      );
      
      setPopupType("success");
      setShowPopup(true);
    } catch (error) {
      console.error("Error marking waypoint complete:", error);
    }
  }

  async function generateQuests(latitude, longitude) {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `Generate 3 random quests in the instructed format. Latitude: ${latitude}, Longitude: ${longitude}`,
        },
      ],
      config: {
        systemInstruction:
          "You are a geographical expert and evaluator of geographical environments. You are tasked to generate 3 quests on what the user should take an image of in the environment, to encourage him to explore. The tasks given should be short to read and easy to interpret. It should not be difficult to find a picture of in that region. Start with the words 'Take a picture of'. Format the resulting text as such: Quest1task,Quest2task,Quest3task (no more further output after this). No commas used within each sentence",
      },
    });
    console.log(result.text);
    setQuestions(result.text);
  }

  return (
    <div>
      {questions && waypointData && isReady ? (
        <div className="min-h-screen bg-[#ffffff]">
          <Header />
          <h1 className="text-black mt-4 ml-4 text-[24px] font-bold">
            {waypointData.name}
          </h1>
          <h2 className="pt-4 pl-3 pr-3">
            <Dropdown
              handleAIEval={verifyPhoto}
              questNo={1}
              taskName={questions.split(",")[0]}
              questId={waypointData.key}
            />
          </h2>
          <h2 className="pt-4 pl-3 pr-3">
            <Dropdown
              handleAIEval={verifyPhoto}
              questNo={2}
              taskName={questions.split(",")[1]}
              questId={waypointData.key}
            />
          </h2>
          <h2 className="pt-4 pl-3 pr-3 pb-4">
            <Dropdown
              handleAIEval={verifyPhoto}
              questNo={3}
              taskName={questions.split(",")[2]}
              questId={waypointData.key}
            />
          </h2>
          
          {showPopup && popupType === "success" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                <h2 className="text-3xl font-bold text-green-600 mb-2">
                  Waypoint Cleared!
                </h2>
                <p className="text-gray-600 mb-6">
                  You've successfully explored {waypointData.name}. Ready for the
                  next region?
                </p>
                <button
                  onClick={() => {
                    router.push("/");
                  }}
                  className="w-full py-3 bg-[#48B3AF] text-white font-bold rounded-xl hover:bg-[#3da19d] transition-colors cursor-pointer"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {showPopup && popupType === "tryAgain" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                <h2 className="text-3xl font-bold text-orange-600 mb-2">
                  Not Quite Right
                </h2>
                <p className="text-gray-600 mb-6">
                  Your image didn't meet the requirement. Please try again with a better photo that matches the quest.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowPopup(false);
                    }}
                    className="flex-1 py-3 bg-blue-400 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      router.push("/");
                    }}
                    className="flex-1 py-3 bg-gray-400 text-white font-bold rounded-xl hover:bg-gray-500 transition-colors cursor-pointer"
                  >
                    Back Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-screen w-screen flex-col flex justify-center items-center bg-white">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-12 h-12 w-8 h-8 text-neutral-tertiary animate-spin fill-brand"
              viewBox="0 0 100 101"
              fill="#5bc684"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
          <p className="mt-4 text-black text-lg">Loading waypoint...</p>
        </div>
      )}
    </div>
  );
}

export default function QuestView() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex-col flex justify-center items-center bg-white">
        <p className="text-black text-lg">Loading...</p>
      </div>
    }>
      <QuestViewContent />
    </Suspense>
  );
}