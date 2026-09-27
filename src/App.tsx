import { useState } from "react";
import "./App.css";
import { supabase } from "./supabase";

const translations = {
  en: {
    invited: "You're invited to",
    title: "Jenny and Mark's Wedding",
    date: "Saturday, June 12, 2027",
    location: "Otterfing, Germany",
    name: "Your Name",
    namePlaceholder: "Your Full Name",
    email: "Your Email",
    emailPlaceholder: "you@example.com",
    attending: "Will you be attending?",
    yes: "Yes",
    no: "No",
    plusOne: "Will you be bringing a +1?",
    plusOneName: "+1 Name",
    plusOnePlaceholder: "Guest's Full Name",
    bringingKids: "Will you be bringing children?",
    howManyKids: "How many kids?",
    kidNames: "What are their names?",
    child: "Child",
    childPlaceholder: "Full Name Here",
    notes: "Notes",
    notesPlaceholder: "Dietary restrictions, questions, etc.",
    submit: "Submit RSVP",
    thankYou: "Thank you!",
    received: "Your RSVP has been received.",
    submitError: "There was a problem submitting your RSVP.",
    photoAlt: "Jenny and Mark",
  },
  de: {
    invited: "Ihr seid eingeladen zur",
    title: "Hochzeit von Jenny und Mark",
    date: "Samstag, 12. Juni 2027",
    location: "Otterfing, Deutschland",
    name: "Dein Name",
    namePlaceholder: "Vor- und Nachname",
    email: "Deine E-Mail-Adresse",
    emailPlaceholder: "du@beispiel.de",
    attending: "Wirst du an unserer Hochzeit teilnehmen?",
    yes: "Ja",
    no: "Nein",
    plusOne: "Bringst du eine Begleitperson (+1) mit?",
    plusOneName: "Name deiner Begleitperson",
    plusOnePlaceholder: "Vor- und Nachname",
    bringingKids: "Bringst du Kinder mit?",
    howManyKids: "Wie viele Kinder?",
    kidNames: "Wie heißen die Kinder?",
    child: "Kind",
    childPlaceholder: "Vor- und Nachname",
    notes: "Anmerkungen",
    notesPlaceholder: "Ernährungswünsche, Fragen usw.",
    submit: "Antwort absenden",
    thankYou: "Vielen Dank!",
    received: "Deine Rückmeldung wurde gespeichert.",
    submitError: "Beim Absenden deiner Rückmeldung ist ein Problem aufgetreten.",
    photoAlt: "Jenny und Mark",
  },
};

function App() {
  const [language, setLanguage] = useState<"en" | "de">("en");
  const t = translations[language];
  const languageSwitch = (
    <div className="language-switch">
      <button
        type="button"
        lang="en"
        className={`language-button ${language === "en" ? "active" : ""}`}
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
      >
        English
      </button>
      <button
        type="button"
        lang="de"
        className={`language-button ${language === "de" ? "active" : ""}`}
        onClick={() => setLanguage("de")}
        aria-pressed={language === "de"}
      >
        Deutsch
      </button>
    </div>
  );
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
 email: formData.get("email") as string,

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
  alert(t.submitError);
  return;
}

setSubmitted(true);
}

if (submitted) {
  return (
    <main className="page" lang={language}>
      <div className="card confirmation">
        {languageSwitch}
        <h1>{t.thankYou}</h1>
        <p>{t.received}</p>
      </div>
    </main>
  );
}

  return (
    <main className="page" lang={language}>
      <div className="card">
        {languageSwitch}

<img
    src="/markjennyluna_banner.jpg"
    alt={t.photoAlt}
    className="banner-image"
  />

        <header className="event-header">
          <p className="eyebrow">{t.invited}</p>

          <h1>{t.title}</h1>

          <p className="event-info">
            {t.date}
            <br />
            ArcheHof Schlickenrieder
            <br />
            Markweg 50, 83624
            <br />
            {t.location}
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <label>
            {t.name}
            <input
              type="text"
              name="name"
              placeholder={t.namePlaceholder}
              required
            />
          </label>

          <label>
  {t.email}
  <input
    type="email"
    name="email"
    placeholder={t.emailPlaceholder}
    required
  />
</label>

         <fieldset>
  <legend>{t.attending}</legend>

  <label className="radio-option">
    <input
      type="radio"
      name="attending"
      value="yes"
      required
      onChange={() => setAttending("yes")}
    />
    {t.yes}
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
    {t.no}
  </label>
</fieldset>

{attending === "yes" && (
  <>

<fieldset>
  <legend>{t.plusOne}</legend>

  <label className="radio-option">
    <input
      type="radio"
      name="plusOne"
      value="yes"
      required
      onChange={() => setBringingPlusOne(true)}
    />
    {t.yes}
  </label>

  <label className="radio-option">
    <input
      type="radio"
      name="plusOne"
      value="no"
      onChange={() => setBringingPlusOne(false)}
    />
    {t.no}
  </label>
</fieldset>

{bringingPlusOne && (
  <label>
    {t.plusOneName}
    <input
      type="text"
      name="plusOneName"
      placeholder={t.plusOnePlaceholder}
      required
    />
  </label>
)}

          <fieldset>
  <legend>{t.bringingKids}</legend>

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
    {t.yes}
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
    {t.no}
  </label>
</fieldset>

{bringingKids && (
  <>
    <fieldset>
      <legend>{t.howManyKids}</legend>

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
          {t.kidNames}
        </p>

        {Array.from({ length: numberOfKids }, (_, index) => (
          <label key={index}>
            {t.child} {index + 1}
            <input
              type="text"
              name={`kidName${index + 1}`}
              placeholder={t.childPlaceholder}
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
            {t.notes}
            <textarea
              name="notes"
              placeholder={t.notesPlaceholder}
            />
          </label>

          <button type="submit">
            {t.submit}
          </button>
        </form>

<div className="photo-gallery">
  <img src="/syssifuss.jpg" alt={t.photoAlt} />
  <img src="/BigBrain.jpg" alt={t.photoAlt} />
  <img src="/Surprised.jpg" alt={t.photoAlt} />

   <img src="/AngryVesper.jpg" alt={t.photoAlt} />
  <img src="/Hugging.jpg" alt={t.photoAlt} />
  <img src="/LunaTico.jpg" alt={t.photoAlt} />

  <img src="/Curious.jpg" alt={t.photoAlt} />
  <img src="/basti.jpg" alt={t.photoAlt} />
  <img src="/littleBigMan.jpg" alt={t.photoAlt} />
</div>

      </div>
    </main>
  );
}

export default App;
