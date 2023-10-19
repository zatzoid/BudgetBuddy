import React, { useState } from "react";
import Profile from "../profile/Profile";


export default function LoaclPosts() {
/* стейт переменная отображает содержи */
    return (
        <section className='local-posts'>
            <Profile />
            <div className="local-posts__slider">

            </div>
        </section>
    )
}