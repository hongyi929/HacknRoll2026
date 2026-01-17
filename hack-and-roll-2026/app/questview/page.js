"use client"
import { useState } from "react";
import Header from "@/components/Header";
import Dropdown from "@/components/Dropdown";

export default function QuestView() {
    return (
        <div className="min-h-screen bg-[#A7E399]">
            <Header/>
            <h1 className="text-black mt-4 ml-4 text-[37px]"> West Coast Park </h1>
            <h2 className="pt-4 pl-3 pr-3">
            <Dropdown taskName="Take a picture of the beach"/>
            </h2>
            <h2 className="pt-4 pl-3 pr-3">
            <Dropdown taskName="Take a picture of the playground"/>
            </h2>
            <h2 className="pt-4 pl-3 pr-3 pb-4">
            <Dropdown taskName="Take a picture of the bike rental shop"/>
            </h2>
        </div>
    )
}