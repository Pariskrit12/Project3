import React, { useState } from "react";
import Cards from "../components/HomeComponents/Cards";

import CommentInput from "../components/common/CommentInput";

const Postpage = () => {
  const [comment, setComment] = useState("");

  return (
    <main>
      <section>
        <Cards showFull={true} />
      </section>
      <section className="mt-5">
        <CommentInput
          placeholder="Write comment"
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
      </section>
    </main>
  );
};

export default Postpage;
