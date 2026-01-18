import React, { useState, useRef } from "react";
import { storage, db } from "../lib/firebase"; // Your firebase config file
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";

const Dropdown = ({ taskName, userId="testplayer", questId, questNo, handleAIEval }) => {
  const [dropTrue, setDropTrue] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [score, setScore] = useState(null);
  const [comments, setComments] = useState(null)
  const [status, setStatus] = useState(null)
  const fileInputRef = useRef(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Upload to Firebase Storage
      const storageRef = ref(storage, `player-quests/${userId}/${questId}/quest${questNo}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);

      const evalScore = await handleAIEval(taskName, file, questNo)
      setScore(evalScore.split(",")[0])
      setComments(evalScore.split(",")[1])

      // 3. Update Firestore & Check Status
      await updateQuestData(url, evalScore);
      console.log("test")

    } catch (error) {
      console.error("Error uploading/grading:", error);
    } finally {
      setUploading(false);
    }
  };

  const updateQuestData = async (url, evalScore) => {
    const playerRef = doc(db, "player-miniwaypoint", `${userId}-${questId}`);
    
    // Update this specific quest
    const updateData = {
      [`quest${questNo}pic`]: url,
      [`quest${questNo}eval`]: parseInt(evalScore.split(",")[0]),
      // Default initial fields if the document is being created for the first time
      userId: userId,
      questId: questId,
      updatedAt: new Date()
    };

    await setDoc(playerRef, updateData, { merge: true });

    // Fetch all quests to determine status
    const docSnap = await getDoc(playerRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const evaluations = [data.quest1eval, data.quest2eval, data.quest3eval];
      
      let newStatus = "active";
      // If all three have scores
      if (evaluations.every(val => typeof val === 'number')) {
        newStatus = evaluations.every(val => val >= 80) ? "completed" : "active";
      }
      
      await updateDoc(playerRef, { status: newStatus });
    }
  };

  return (
    <div className="w-full">
      <div onClick={() => setDropTrue(!dropTrue)} className="cursor-pointer">
        <h2 className={`flex bg-[#5bc684] ml-2 mr-2 mt-4 pl-4 pt-4 pb-8 text-[20px] text-black transition-all duration-200 ${dropTrue ? "rounded-t-lg" : "rounded-lg"}`}>
          <img src="images/arrow-down.png" className={`w-4 h-4 ml-2 mt-2 mr-3 transition-transform duration-200 ${dropTrue ? "rotate-180" : ""}`} />
          {taskName}
          {score !== null && <span className="ml-auto mr-4 font-bold text-white bg-black/20 px-2 rounded">Score: {score}</span>}
        </h2>
      </div>

      {dropTrue && (
        <div className="bg-[#5bc684] rounded-b-lg ml-2 mr-2 pl-4 pb-8 -mt-[1px] border-t border-blue-200/30">
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
          
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="cursor-pointer mb-4 bg-white text-[#48B3AF] px-4 py-2 rounded font-bold hover:bg-gray-100 disabled:opacity-50"
          >
            {uploading ? "Analyzing..." : "Upload Picture!"}
          </button>

          <div className="w-[340px] h-[210px] bg-black rounded overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt="Quest" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No image uploaded</span>
            )}
            
          </div>
          {comments !== null && <p>{comments}</p>}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
