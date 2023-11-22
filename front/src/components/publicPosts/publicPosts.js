import React, { useEffect, useState } from "react";

import { publicData } from "../../utils/constants";


import PublicEl from "./PublicEl/PublicEl";

export default function PublicPost() {
    const [testData, setTestData] = useState(publicData)


    return (
        <div className="public-post">
            <ul className="public-post__list">
                {Array.isArray(testData) && testData.map((item) => (
                    <PublicEl key={item._id}
                        dataEl={item}
                    />
                ))}
            </ul>
        </div>

    )
}