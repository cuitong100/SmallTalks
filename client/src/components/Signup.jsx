import React, { useEffect, useState } from "react";
import TalkCard from "./TalkCard";
import NavigationBar from "./NavigationBar";
import SignupForm from "./SignupForm";

export default function Signup({ params }) {

    return (
        <div>
            <NavigationBar />
            <SignupForm />
        </div>
    )
};