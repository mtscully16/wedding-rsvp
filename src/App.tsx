import { useState } from "react";
import "./App.css";
import { supabase } from "./supabase";

function App() {
  const [submitted, setSubmitted] = useState(false);
const [bringingPlusOne, setBringingPlusOne] = useState(false);
const [bringingKids, setBringingKids] = useState(false);
const [numberOfKids, setNumberOfKids] = useState(0);
const [attending, setAttending] = useState<"yes" | "no" | "">("");

 async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

const kidNames = Array.from(
  { length: numberOfKids },
  (_, index) =>
    formData.get(`kidName${index + 1}`) as string
);

const response = {
  name: formData.get("name") as string,
  attending: formData.get("attending") === "yes",

  bringing_plus_one:
    formData.get("plusOne") === "yes",

  plus_one_name:
    bringingPlusOne
      ? (formData.get("plusOneName") as string)
      : null,

  bringing_kids:
    formData.get("bringingKids") === "yes",

  number_of_kids:
    bringingKids ? numberOfKids : 0,

  kid_names:
    bringingKids ? kidNames : [],

  notes:
    (formData.get("notes") as string) || null,
};

const { error } = await supabase
  .from("RSVPs")
  .insert([response]);

if (error) {
  console.error("Error saving RSVP:", error);
  alert("There was a problem submitting your RSVP.");
  return;
}

setSubmitted(true);
}

if (submitted) {
  return (
    <main className="page">
      <div className="card confirmation">
        <h1>Thank you!</h1>
        <p>Your RSVP has been received.</p>
      </div>
    </main>
  );
}

  return (
    <main className="page">
      <div className="card">

<img
    src="/markjennyluna_banner.jpg"
    alt="Jenny and Mark"
    className="banner-image"
  />

        <header className="event-header">
          <p className="eyebrow">You're invited to</p>

          <h1>Jenny and Mark's Wedding</h1>

          <p className="event-info">
            Saturday, June 12 2027
            <br />
            ArcheHof Schlickenrieder
            <br />
            Markweg 50, 83624
            <br />
            Otterfing, Germany
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <label>
            Your Name
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              required
            />
          </label>

         <fieldset>
  <legend>Will you be attending?</legend>

  <label className="radio-option">
    <input
      type="radio"
      name="attending"
      value="yes"
      required
      onChange={() => setAttending("yes")}
    />
    Yes
  </label>

  <label className="radio-option">
    <input
      type="radio"
      name="attending"
      value="no"
      onChange={() => {
        setAttending("no");
        setBringingPlusOne(false);
        setBringingKids(false);
        setNumberOfKids(0);
      }}
    />
    No
  </label>
</fieldset>

{attending === "yes" && (
  <>

<fieldset>
  <legend>Will you be bringing a +1?</legend>

  <label className="radio-option">
    <input
      type="radio"
      name="plusOne"
      value="yes"
      required
      onChange={() => setBringingPlusOne(true)}
    />
    Yes
  </label>

  <label className="radio-option">
    <input
      type="radio"
      name="plusOne"
      value="no"
      onChange={() => setBringingPlusOne(false)}
    />
    No
  </label>
</fieldset>

{bringingPlusOne && (
  <label>
    +1 Name
    <input
      type="text"
      name="plusOneName"
      placeholder="Guest's Full Name"
      required
    />
  </label>
)}

          <fieldset>
  <legend>Will you be bringing children?</legend>

  <label className="radio-option">
    <input
      type="radio"
      name="bringingKids"
      value="yes"
      required
      onChange={() => {
        setBringingKids(true);
      }}
    />
    Yes
  </label>

  <label className="radio-option">
    <input
      type="radio"
      name="bringingKids"
      value="no"
      onChange={() => {
        setBringingKids(false);
        setNumberOfKids(0);
      }}
    />
    No
  </label>
</fieldset>

{bringingKids && (
  <>
    <fieldset>
      <legend>How many kids?</legend>

      <div className="number-options">
        {[1, 2, 3, 4, 5].map((number) => (
          <label key={number} className="number-option">
            <input
              type="radio"
              name="numberOfKids"
              value={number}
              required
              onChange={() => setNumberOfKids(number)}
            />
            <span>{number}</span>
          </label>
        ))}
      </div>
    </fieldset>

    {numberOfKids > 0 && (
      <div className="kid-names">
        <p className="section-label">
          What are their names?
        </p>

        {Array.from({ length: numberOfKids }, (_, index) => (
          <label key={index}>
            Child {index + 1}
            <input
              type="text"
              name={`kidName${index + 1}`}
              placeholder={`Full Name Here`}
              required
            />
          </label>
        ))}
      </div>
    )}
  </>
)}

 </>
)}

          <label>
            Notes
            <textarea
              name="notes"
              placeholder="Dietary restrictions, questions, etc."
            />
          </label>

          <button type="submit">
            Submit RSVP
          </button>
        </form>

<div className="photo-gallery">
  <img src="/syssifuss.jpg" alt="Jenny and Mark" />
  <img src="/BigBrain.jpg" alt="Jenny and Mark" />
  <img src="/Surprised.jpg" alt="Jenny and Mark" />

   <img src="/AngryVesper.jpg" alt="Jenny and Mark" />
  <img src="/Hugging.jpg" alt="Jenny and Mark" />
  <img src="/LunaTico.jpg" alt="Jenny and Mark" />

  <img src="/Curious.jpg" alt="Jenny and Mark" />
  <img src="/basti.jpg" alt="Jenny and Mark" />
  <img src="/littleBigMan.jpg" alt="Jenny and Mark" />
</div>

      </div>
    </main>
  );
}

export default App;