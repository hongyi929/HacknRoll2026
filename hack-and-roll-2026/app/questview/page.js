"use client";
import { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { db } from "../../lib/firebase"; // Ensure db is imported
import { doc, onSnapshot } from "firebase/firestore";
import Header from "@/components/Header";
import Dropdown from "@/components/Dropdown";
import { useRouter } from "next/navigation";

export default function QuestView() {
    let router = useRouter()
  const [showPopup, setShowPopup] = useState(false);
  const [questions, setQuestions] = useState(null);
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  async function verifyPhoto(questName, image) {
    const base64ImageData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(image);
    });

    const docRef = doc(db, "player-miniwaypoint", `testplayer-central_hub`);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Current status:", data.status);

        if (data.status === "completed") {
          setShowPopup(true);
        }
      }
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
          text: "Score the image from 0 to 100. 60 and above is a pass. Quest: Take a picture of the playground . Longitude: 1.3 , Latitude: 103.8",
        },
      ],
      config: {
        systemInstruction:
          "You are a geographical expert and evaluator of geographical environments. When the image is sent back to you with the quest prompt, you need to evaluate the location assigned to them and whether the image is accurate in the location and in matching the quest prompt, scoring between 1 to 100 based on accuracy to location and quest. Your first line should be formatted as such: Score,Reasoning(output does not continue here. score is a number. example output: 32,Weak Reasoning reasoning is short)",
      },
    });
    return result.text;
  }

  async function generateQuests(latitude, longitude) {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `Generate 3 random quests in the instructed format. Latitude: ${latitude}, Longitude: ${longitude}}}`,
        },
      ],
      config: {
        systemInstruction:
          "You are a geographical expert and evaluator of geographical environments. You are tasked to generate 3 quests on what the user should take an image of in the environment, to encourage him to explore. The tasks given should be short to read and easy to interpret. Start with the words 'Take a picture of'. Format the resulting text as such: Quest1task,Quest2task,Quest3task (no more further output after this.)",
      },
    });
    console.log(result.text);
    setQuestions(result.text);
  }
  useEffect(() => {
    generateQuests(1.3048, 103.8318);
  }, []);
  return (
    <div>
      {questions ? (
        <div className="min-h-screen bg-[#A7E399]">
          <Header />
          <h1
            className="text-black mt-4 ml-4 text-[37px]"
            
          >
            {" "}
            West Coast Park{" "}
          </h1>
          <h2 className="pt-4 pl-3 pr-3">
            <Dropdown
              handleAIEval={verifyPhoto}
              questNo={1}
              taskName={questions.split(",")[0]}
            />
          </h2>
          <h2 className="pt-4 pl-3 pr-3">
            <Dropdown
              handleAIEval={verifyPhoto}
              questNo={2}
              taskName={questions.split(",")[1]}
            />
          </h2>
          <h2 className="pt-4 pl-3 pr-3 pb-4">
            <Dropdown
              handleAIEval={verifyPhoto}
              questNo={3}
              taskName={questions.split(",")[2]}
            />
          </h2>
          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                <h2 className="text-3xl font-bold text-green-600 mb-2">
                  Waypoint Cleared!
                </h2>
                <p className="text-gray-600 mb-6">
                  You've successfully explored West Coast Park. Ready for the
                  next region?
                </p>
                <button
                  onClick={() => {
                    router.push("/")

                  }}
                  className="w-full py-3 bg-[#48B3AF] text-white font-bold rounded-xl hover:bg-[#3da19d] transition-colors cursor-pointer"
                >
                  Complete Quest
                </button>
              </div>
            </div>
          )}

          {/* Rest of your existing JSX */}
        </div>
      ) : (
        <div className="h-screen w-screen flex justify-center items-center">
          Loading
        </div>
      )}
    </div>
  );
}
//
