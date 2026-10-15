import hq1 from './assets/projects/hospital-queue-1.jpg'
import hq2 from './assets/projects/hospital-queue-2.jpg'
import hq3 from './assets/projects/hospital-queue-3.jpg'
import hq4 from './assets/projects/hospital-queue-4.jpg'
import hq5 from './assets/projects/hospital-queue-5.jpg'
import hq6 from './assets/projects/hospital-queue-6.jpg'
import hq7 from './assets/projects/hospital-queue-7.jpg'
import hq8 from './assets/projects/hospital-queue-8.jpg'
import hq9 from './assets/projects/hospital-queue-9.jpg'
import hq10 from './assets/projects/hospital-queue-10.jpg'
import hq11 from './assets/projects/hospital-queue-11.jpg'
import hq12 from './assets/projects/hospital-queue-12.jpg'
import hq13 from './assets/projects/hospital-queue-13.jpg'
import hq14 from './assets/projects/hospital-queue-14.jpg'
import si1 from './assets/projects/smart-irrigation-1.jpg'
import si2 from './assets/projects/smart-irrigation-2.jpg'
import si3 from './assets/projects/smart-irrigation-3.jpg'
import si4 from './assets/projects/smart-irrigation-4.jpg'
import si5 from './assets/projects/smart-irrigation-5.jpg'
import si6 from './assets/projects/smart-irrigation-6.jpg'
import si7 from './assets/projects/smart-irrigation-7.jpg'
import si8 from './assets/projects/smart-irrigation-8.jpg'
import si9 from './assets/projects/smart-irrigation-9.jpg'
import si10 from './assets/projects/smart-irrigation-10.png'
import si11 from './assets/projects/smart-irrigation-11.png'
import si12 from './assets/projects/smart-irrigation-12.png'
import si13 from './assets/projects/smart-irrigation-13.png'
import si14 from './assets/projects/smart-irrigation-14.png'
import si15 from './assets/projects/smart-irrigation-15.png'
import si16 from './assets/projects/smart-irrigation-16.png'
import si17 from './assets/projects/smart-irrigation-17.png'
import si18 from './assets/projects/smart-irrigation-18.png'
import si19 from './assets/projects/smart-irrigation-19.png'
import si20 from './assets/projects/smart-irrigation-20.png'
import si21 from './assets/projects/smart-irrigation-21.png'
import si22 from './assets/projects/smart-irrigation-22.jpg'
import od1 from './assets/projects/object-detection-1.jpg'
import od2 from './assets/projects/object-detection-2.jpg'
import od3 from './assets/projects/object-detection-3.jpg'
import od4 from './assets/projects/object-detection-4.jpg'
import od5 from './assets/projects/object-detection-5.jpg'
import od6 from './assets/projects/object-detection-6.jpg'
import od7 from './assets/projects/object-detection-7.jpg'
import od8 from './assets/projects/object-detection-8.jpg'
import od9 from './assets/projects/object-detection-9.jpg'
import od10 from './assets/projects/object-detection-10.png'
import od11 from './assets/projects/object-detection-11.png'
import sc1 from './assets/projects/safety-checklist-1.jpg'
import sc2 from './assets/projects/safety-checklist-2.jpg'
import sc3 from './assets/projects/safety-checklist-3.jpg'
import sc4 from './assets/projects/safety-checklist-4.jpg'
import sc5 from './assets/projects/safety-checklist-5.jpg'
import sc6 from './assets/projects/safety-checklist-6.jpg'
import sc7 from './assets/projects/safety-checklist-7.jpg'
import sc8 from './assets/projects/safety-checklist-8.jpg'
import sc9 from './assets/projects/safety-checklist-9.jpg'
import sc10 from './assets/projects/safety-checklist-10.jpg'
import sc11 from './assets/projects/safety-checklist-11.jpg'
import st1 from './assets/projects/staff-calendar-1.jpg'
import st2 from './assets/projects/staff-calendar-2.jpg'
import st3 from './assets/projects/staff-calendar-3.jpg'
import st4 from './assets/projects/staff-calendar-4.jpg'
import st5 from './assets/projects/staff-calendar-5.jpg'
import st6 from './assets/projects/staff-calendar-6.jpg'
import st7 from './assets/projects/staff-calendar-7.jpg'
import st8 from './assets/projects/staff-calendar-8.jpg'
import st9 from './assets/projects/staff-calendar-9.jpg'
import st10 from './assets/projects/staff-calendar-10.jpg'
import st11 from './assets/projects/staff-calendar-11.jpg'
import st12 from './assets/projects/staff-calendar-12.jpg'
import st13 from './assets/projects/staff-calendar-13.jpg'
import pb1 from './assets/projects/phonebook-1.jpg'
import pb2 from './assets/projects/phonebook-2.jpg'
import pb3 from './assets/projects/phonebook-3.jpg'
import pb4 from './assets/projects/phonebook-4.jpg'
import pb5 from './assets/projects/phonebook-5.jpg'
import pb6 from './assets/projects/phonebook-6.jpg'
import pb7 from './assets/projects/phonebook-7.jpg'
import pb8 from './assets/projects/phonebook-8.jpg'
import pb9 from './assets/projects/phonebook-9.jpg'
import pb10 from './assets/projects/phonebook-10.jpg'
import pb11 from './assets/projects/phonebook-11.jpg'
import pb12 from './assets/projects/phonebook-12.jpg'
import ca1 from './assets/projects/clinic-assistant-1.webp'
import ca2 from './assets/projects/clinic-assistant-2.webp'
import ca3 from './assets/projects/clinic-assistant-3.webp'
import ca4 from './assets/projects/clinic-assistant-4.webp'
import pf1 from './assets/projects/portfolio-1.jpg'
import pf2 from './assets/projects/portfolio-2.webp'
import pf3 from './assets/projects/portfolio-3.webp'
import pf4 from './assets/projects/portfolio-4.jpg'
import pf5 from './assets/projects/portfolio-5.jpg'
import pf5mp4 from './assets/projects/portfolio-5.mp4'
import pf6 from './assets/projects/portfolio-6.webp'
import pf7 from './assets/projects/portfolio-7.jpg'
import pf8 from './assets/projects/portfolio-8.png'
import pf9 from './assets/projects/portfolio-9.jpg'
import pf10 from './assets/projects/portfolio-10.jpg'
import pf10mp4 from './assets/projects/portfolio-10.mp4'

/** One slide in a case study's showcase. Without `src` it is a placeholder drawn from the project's art until a picture is added. */
export type Shot = { src?: string; caption: string; group?: string; about?: string
  /** show the whole picture, no zoom */
  still?: boolean
  /** still photos only: shrink the photo inside the slide (1 = fit to height) */
  zoom?: number
  /** 'phone' puts a portrait app screen in a phone frame, 'window' puts a code screenshot in an editor window */
  frame?: 'phone' | 'window'
  /** screen shape inside the phone frame, e.g. '3 / 5'; defaults to a tall modern phone */
  ratio?: string
  /** a drawn chart or flow rather than a screen */
  diagram?: boolean
  /** label on the window's title bar */
  file?: string
  /** short muted clip that loops in place of the picture; `src` stays as its poster */
  video?: { webm?: string; mp4: string }
  /** product-launch style slide: the phone drops in and plays `video` on its screen */
  promo?: boolean
  /** how long the slide stays up before autoplay moves on (default 6s) */
  seconds?: number
}

export type Project = {
  no: string
  title: string
  short: string
  tags: string[]
  award?: string
  oneLiner: string
  body: string
  year: string
  role: string
  hue: number
  /** Showcase slides, first one is the cover. Picture files live in src/assets/projects/. */
  shots?: Shot[]
  /** 'photos' shows the pictures full-bleed with landscape posters; the default suits phone screenshots. */
  showcase?: 'screens' | 'photos'
  motif: 'queue' | 'leaf' | 'scan' | 'orbit' | 'check' | 'grid' | 'tree' | 'sop'
  /** the project's own repository; the case study falls back to the GitHub profile */
  repo?: string
}

export const projects: Project[] = [
  {
    no: '01',
    title: 'AI-Powered Hospital Queue Management System',
    short: 'Hospital Queue',
    tags: ['Dart', 'Flutter', 'Random Forest', 'Supabase', 'OneSignal'],
    award: 'Gold Medal, Final Year Project Industry Award',
    oneLiner: 'Two queues, not one. That is why the estimates drift.',
    body:
      'Malaysian government clinics run two queues, not one. There is the screening line and then the doctor. Existing apps model a single line, which is why their estimates drift by the time you reach the front. This one runs two independent Random Forest models, where the second only starts predicting once the first stage completes. Built in Flutter on Supabase, with scheduled push notifications so patients are told before their turn, not after.',
    year: '2026',
    role: 'Final Year Project',
    hue: 18,
    motif: 'queue',
    shots: [
      { src: hq1, frame: 'phone', ratio: '3 / 5', caption: 'Patient dashboard', group: 'Patient app', about: 'The patient\'s dashboard. Ministry of Health news sits on top, and below it a live countdown for the screening queue, estimated by the first Random Forest model.' },
      { src: hq2, frame: 'phone', ratio: '3 / 5', caption: 'Your-turn alert', group: 'Patient app', about: 'Three minutes before their turn, the patient is asked to confirm they are in the waiting area, so people who have left don\'t hold up the line.' },
      { src: hq3, caption: 'Sign in', group: 'Patient app', about: 'Patients sign in with email or Google. Clinic staff go through the separate Staff Portal link at the bottom.' },
      { src: hq4, frame: 'phone', ratio: '3 / 5', caption: 'Screening queue', group: 'Patient app', about: 'Every patient sees their own estimate for the same queue, updated as the people ahead of them are screened.' },
      { src: hq13, frame: 'phone', ratio: '3 / 5', caption: 'AI assistant', group: 'Patient app', about: 'While they wait, patients can ask the Gemini chatbot where things are. It first asks where they are standing, then gives walking directions inside the hospital.' },
      { src: hq5, frame: 'phone', ratio: '3 / 5', caption: 'Staff · screening dashboard', group: 'Staff app', about: 'Staff see everyone waiting for screening and who has waited longest, and can call, skip or give extra time to each patient.' },
      { src: hq6, frame: 'phone', ratio: '3 / 5', caption: 'Staff · consultation dashboard', group: 'Staff app', about: 'After screening, patients move into the doctor\'s queue. The second model only starts estimating once the first stage is done.' },
      { src: hq7, frame: 'window', file: 'Architecture', diagram: true, caption: 'How the pieces talk', group: 'Design', about: 'The Flutter app keeps the queue in Supabase, asks a Flask server for wait times from two Random Forest models, schedules alerts through OneSignal and runs the chatbot on Google Gemini.' },
      { src: hq8, frame: 'window', file: 'main.dart', caption: 'A chatbot that knows the building', group: 'Code', about: 'The Gemini chatbot is given the hospital floor plan. It asks where the patient is before giving walking directions, and replies in Malay or English to match the patient.' },
      { src: hq9, frame: 'window', file: 'main.dart', caption: 'Taking a number', group: 'Code', about: 'Joining the queue counts who is already waiting and asks the AI server for an estimate. The wait is never shorter than the last person in line plus five minutes.' },
      { src: hq14, frame: 'window', file: 'main.dart', caption: 'The queue in Supabase', group: 'Database', about: 'Every ticket is one row in the hospital_queue table. Staff read the whole queue with each patient\'s name, calling a patient updates the row and sends a push, and finishing screening moves them into the doctor\'s queue.' },
      { src: hq10, frame: 'window', file: 'app.py', caption: 'The AI server', group: 'Code', about: 'A small Flask server loads both Random Forest models and gives each queue its own route. The time and day go in, an estimate in minutes comes out.' },
      { src: hq11, frame: 'window', file: 'main.dart', caption: 'Alert before your turn', group: 'Code', about: 'Once the wait is known, a push notification is booked with OneSignal for three minutes before the turn, so it still arrives if the app is closed.' },
      { src: hq12, frame: 'window', file: 'main.dart', caption: 'When the line speeds up', group: 'Code', about: 'When a patient finishes early, the time saved comes off everyone behind them, and each of them is told by push notification.' },
    ],
  },
  {
    no: '02',
    title: 'AI-Integrated Smart Irrigation',
    short: 'Smart Irrigation',
    tags: ['ESP32', 'Decision Tree', 'C++', 'Embedded'],
    award: 'Gold, IDP Showcase Day. Second in Agriculture from more than ten teams.',
    oneLiner: 'It waters when the soil is dry, not when the clock says so.',
    body:
      'An irrigation prototype that waters when the soil is dry rather than when a timer says so. Soil moisture drives the decision, and a Decision Tree running on the ESP32 itself predicts local weather so the system keeps working with no cloud connection. A system that depends on the internet will eventually not have it.',
    year: '2026',
    role: 'Integrated Design Project · Team of 5',
    hue: 145,
    motif: 'leaf',
    showcase: 'photos',
    shots: [
      { src: si1, still: true, zoom: 0.8, caption: 'Team AG3', group: 'Team', about: 'Group AG3 at the IDP Showcase: a smart irrigation system that waters from harvested rainwater, built by a team of five.' },
      { src: si2, caption: 'Picking the project', group: 'Planning', about: 'The first discussions, held online. We looked at rainwater harvesting ideas, settled on what to build and split the work into parts for each member.' },
      { src: si3, caption: 'First wiring', group: 'Build', about: 'Testing each sensor, pump and relay on its own, then wiring them together to understand how the hardware flows from end to end.' },
      { src: si4, caption: 'Designing the house', group: 'Planning', about: 'Drawing the prototype house, from the rainwater tank through the filter to the plants, and deciding what materials to build it from.' },
      { src: si5, caption: 'Building the house', group: 'Build', about: 'Cutting and assembling the model house in the faculty workshop.' },
      { src: si6, caption: 'Touching it up', group: 'Build', about: 'Tidying the prototype and the house model so the whole system reads cleanly: roof, tanks, tubing and the plant shelf.' },
      { src: si7, caption: 'Showcase morning', group: 'Showcase', about: 'Final preparation before the IDP Showcase opened, with live readings on the tablet, the LCD on the house and our poster beside it.' },
      { src: si8, caption: 'Gold medal', group: 'Result', about: 'Second place in the Agriculture cluster, and a gold medal for the project.' },
      { src: si9, frame: 'phone', caption: 'Blynk dashboard', group: 'App', about: 'The Blynk app shows soil moisture for every vase, both tank levels, humidity and temperature, with a switch to run each pump by hand.' },
      { src: si10, frame: 'window', file: 'auto_watering.ino', caption: 'Leak detection', group: 'Code', about: 'Before watering, the system records how wet the soil is. When the pump stops it checks again, and if the soil barely changed it assumes a leak or a loose hose and alerts the user on Telegram.' },
      { src: si11, frame: 'window', file: 'tank_transfer.ino', caption: 'Rainwater transfer', group: 'Code', about: 'Two ultrasonic sensors watch the tanks. The transfer pump only moves rainwater across when the rain tank is full and the clean tank has room, so neither can overflow.' },
      { src: si12, frame: 'window', file: 'alerts.ino', caption: 'One alert, not fifty', group: 'Code', about: 'When the clean tank runs dry, a flag makes sure the user gets exactly one Telegram message, not a new one every loop.' },
      { src: si13, frame: 'window', file: 'weather.ino', caption: 'Weather check', group: 'Code', about: 'Every 15 minutes, without pausing anything else, the board asks its on-device model for a forecast. Telegram only hears about it when the forecast changes.' },
      { src: si14, frame: 'window', file: 'preprocess.py', caption: 'Loading in chunks', group: 'Data', about: 'Instead of loading the whole Malaysian weather dataset from Kaggle into memory, the script reads it 100,000 rows at a time, so even a huge CSV never runs out of RAM.' },
      { src: si15, frame: 'window', file: 'preprocess.py', caption: 'Filtering by mask', group: 'Data', about: 'One boolean mask filters every chunk by state and date range at once. Vectorised Pandas operations keep it fast.' },
      { src: si16, frame: 'window', file: 'preprocess.py', caption: 'Columns and saving', group: 'Data', about: 'Each required column is checked before it is selected, then every chunk is appended to the output file, with the header written only once.' },
      { src: si17, frame: 'window', file: 'train_model.py', caption: 'Labels and outliers', group: 'Model', about: 'Rainfall becomes three labels: sunny, cloudy and rain. Contradictory records, such as no rain at over 90% humidity, are removed before training.' },
      { src: si18, frame: 'window', file: 'train_model.py', caption: '70 / 15 / 15 split', group: 'Model', about: 'The data is split 70/15/15 into training, validation and test sets, so the model is judged on data it has never seen.' },
      { src: si19, frame: 'window', file: 'train_model.py', caption: 'Training the tree', group: 'Model', about: 'A Decision Tree with balanced class weights for uneven weather data and a depth limit of 10 to stop overfitting, saved with Joblib for conversion to C++.' },
      { src: si20, frame: 'window', file: 'output', caption: 'The results', group: 'Model', about: '69.46% on validation and 68.81% on test, so the model generalises well. It catches 94% of sunny days. Cloudy days are hard to separate using only temperature and humidity, and a pressure sensor would help next time.' },
      { src: si21, frame: 'window', file: 'weather.h', caption: 'Running on the ESP32', group: 'Edge AI', about: 'The trained tree is rewritten as plain C++ conditions, so the board predicts the weather itself. No cloud API, low latency, and it keeps working without internet.' },
      { src: si22, frame: 'phone', caption: 'Live testing', group: 'Testing', about: 'In the first live tests, the Telegram bot delivered weather updates and failsafe alerts in real time. It also fired the empty-tank alert again and again, which led to the one-alert flag in the code.' },
    ],
  },
  {
    no: '03',
    title: 'Clinic Procedure Assistant',
    short: 'Clinic Assistant',
    tags: ['Python', 'Ollama', 'RAG', 'Gradio'],
    oneLiner: "It answers from the clinic's own rules, and says so when it can't.",
    body:
      "Patients ask the counter the same questions every day, and the answers already sit in the clinic's SOPs. General chatbots guess. This assistant retrieves the relevant SOP section, answers only from it and cites it. If the SOPs do not cover a question it says so, and medical questions are refused before any model call. It runs on a laptop through Ollama, so no question leaves the machine. I tested two local models on the same ten questions and kept qwen2.5:3b: 8 of 10 fully correct when checked by hand and none wrong, against two wrong answers from the 1.5b model.",
    year: '2026',
    role: 'Personal project',
    hue: 95,
    motif: 'sop',
    repo: 'https://github.com/amirulfahmiii920-beep/clinic-procedure-assistant',
    showcase: 'photos',
    shots: [
      { src: ca1, frame: 'window', file: '127.0.0.1:7860', caption: 'Every answer cites the SOP section it came from', group: 'Answers', about: 'Asked which documents to bring, it answers from SOP-01 sections 2 and 4 and cites both. The panel on the right shows the exact passages the model was given and how closely each one matched the question.' },
      { src: ca2, frame: 'window', file: '127.0.0.1:7860', caption: 'Follow-up questions keep their context', group: 'Answers', about: '"What if I forgot it?" is searched together with the previous question, so it finds the section on a forgotten identity card and answers from it.' },
      { src: ca3, frame: 'window', file: '127.0.0.1:7860', caption: 'When the SOPs are silent, it says so', group: 'Guardrails', about: 'No SOP section scored above the relevance cutoff for a question about parking, so instead of guessing it says the SOPs do not cover it and points the patient to the counter.' },
      { src: ca4, frame: 'window', file: '127.0.0.1:7860', caption: 'Medical questions are refused before any model call', group: 'Guardrails', about: 'A question about medicine for a fever is caught by a scope check before any search or model call. The patient is sent to a doctor or pharmacist, or to the treatment room in an emergency.' },
    ],
  },
  {
    no: '04',
    title: 'Real-Time Object Detection',
    short: 'Object Detection',
    tags: ['YOLO', 'Python', 'Roboflow', 'Computer Vision'],
    oneLiner: 'Finding where the model stops learning and starts memorising.',
    body:
      'A YOLO detection pipeline trained on 1,152 curated and augmented images, with a comparative study across 100, 150 and 200 epochs to find the point where the model stops learning and starts memorising. Five-person project. I handled the dataset pipeline and the epoch comparison.',
    year: '2025',
    role: 'Dataset pipeline & epoch study',
    hue: 210,
    motif: 'scan',
    showcase: 'photos',
    shots: [
      { src: od1, still: true, caption: 'The team', group: 'Team', about: 'Our group for the Computer Architecture and Organization course.' },
      { src: od2, frame: 'window', file: 'Roboflow · dataset v2', caption: 'Building the dataset', group: 'Data', about: '1,152 images in Roboflow, split 975 / 94 / 83 for training, validation and testing. Each image is auto-oriented and resized to 640×640, and crop-zoom and saturation augmentations give three versions of every training image.' },
      { src: od3, frame: 'window', file: 'Colab · 100 epochs', caption: '100 epochs', group: 'Training', about: 'The first run, in Google Colab with Ultralytics, trained for 100 epochs. The loss curves were still falling at the end, so the model had more to learn.' },
      { src: od4, frame: 'window', file: 'Colab · 150 epochs', caption: '150 epochs', group: 'Training', about: 'Raising the budget to 150 epochs, a 2.302-hour run, gave the best balance between low validation loss and high precision. This became the final model.' },
      { src: od5, frame: 'window', file: 'Colab · 200 epochs', caption: 'Stopped at 187', group: 'Study', about: 'With a 200-epoch budget, training stopped early at epoch 187. The extra epochs only made the model memorise the training data, with no gain in precision.' },
      { src: od11, frame: 'window', file: 'evaluate_runs.py', caption: 'Proving 150 was best', group: 'Study', about: 'Instead of guessing, a Pandas script reads the Ultralytics logs from the 100, 150 and 200 epoch runs, picks each run\'s best epoch by mAP and totals its validation loss. The numbers show 150 epochs is the sweet spot, before the overfitting seen at 200.' },
      { src: od6, frame: 'window', file: 'Batch inference · 150 epochs', caption: 'Detection results', group: 'Results', about: 'The 150-epoch model finds computers across different rooms, lighting and camera angles. It sometimes calls a standalone monitor or desktop case a full computer, and more non-computer images from varied angles would teach it the difference.' },
      { src: od7, frame: 'window', file: 'Colab · best.pt', caption: 'Training complete', group: 'Training', about: 'The 150-epoch run finished and was validated, producing the best.pt weights. These weights are the model that powers the app.' },
      { src: od8, frame: 'window', file: 'Sample input', caption: 'Testing the app', group: 'Deployment', about: 'A sample image used to test the model. The best.pt weights were built into a FastAPI app where users upload an image and see the detected bounding boxes.' },
      { src: od10, frame: 'window', file: 'main.py', caption: 'The detection API', group: 'Deployment', about: 'A FastAPI endpoint takes an uploaded image, checks its type and size, runs the YOLO model and returns every detection as clean JSON with the annotated image attached. Any web or mobile app can call it.' },
      { src: od9, frame: 'window', file: 'demo.roboflow.com', caption: 'Real-time detection', group: 'Field test', about: 'Before the FastAPI app, the trained weights ran in the Roboflow web demo on a phone, detecting computers live at about 4 to 8 frames per second. I handled the dataset pipeline and the epoch study in a team of five.' },
    ],
  },
  {
    no: '05',
    title: 'This Portfolio',
    short: 'Portfolio',
    tags: ['React', 'TypeScript', 'Three.js', 'GSAP'],
    oneLiner: 'The site you are reading right now.',
    body:
      'The site you are reading right now. Built in React and TypeScript, with Three.js handling the 3D work and GSAP driving the motion. Written to be a portfolio I could keep changing rather than a template I would be stuck with.',
    year: '2026',
    role: 'Design & development',
    hue: 265,
    motif: 'orbit',
    showcase: 'photos',
    shots: [
      { src: pf1, frame: 'window', file: 'Home', caption: 'The 3D hero', group: 'Website', about: 'The landing page is a live Three.js scene. The shapes float, turn toward the cursor and are lit by a warm light that follows the mouse.' },
      { src: pf2, frame: 'window', file: 'HeroScene.tsx', caption: 'Building the scene', group: 'Code', about: 'Twelve shapes in three materials (chrome, bone and ember) are placed by hand around a faceted core with a wireframe shell.' },
      { src: pf3, frame: 'window', file: 'HeroScene.tsx', caption: 'Shapes that dodge the cursor', group: 'Code', about: 'Every frame, shapes near the cursor get pushed away and drift back. Nearer shapes move further with scroll and mouse, which gives the scene its depth.' },
      { src: pf4, frame: 'window', file: 'Selected Work', caption: 'Hover previews', group: 'Website', about: 'Hovering a project shows a floating preview that follows the cursor with a little tilt and flips through its screenshots.' },
      { src: pf5, video: { mp4: pf5mp4 }, frame: 'window', file: 'Page transition', caption: 'Page transitions', group: 'Motion', about: 'A walk through the whole site. Every jump, from the menu or into a project, sweeps a two-layer curtain across the screen and swaps the page underneath while it is covered.' },
      { src: pf6, frame: 'window', file: 'Transition.tsx', caption: 'The curtain timeline', group: 'Code', about: 'One GSAP timeline drives the curtain. Transitions that are requested while one is running wait in a queue instead of being dropped.' },
      { src: pf7, frame: 'window', file: 'Case study', caption: 'Netflix-style case studies', group: 'Website', about: 'Every project opens into its own case study with a slideshow of photos, app screens and code, like the one you are reading now.' },
      { src: pf8, frame: 'window', file: 'data.ts', caption: 'Content as data', group: 'Code', about: 'All the text and pictures live in one data file, so adding a slide means adding one line rather than touching the layout.' },
      { src: pf9, frame: 'window', file: 'About', caption: 'Sections that change theme', group: 'Motion', about: 'The page switches between dark, light and ember themes as you scroll, and the About text lights up word by word.' },
      { src: pf10, video: { mp4: pf10mp4 }, promo: true, seconds: 28, frame: 'phone', caption: 'Built for phones too', group: 'Mobile', about: 'The same site on a phone: the menu, page transitions and case studies all work by touch, with the 3D scene pulled back so the whole composition still fits on a narrow screen.' },
    ],
  },
  {
    no: '06',
    title: 'Workstation Safety Checklist',
    short: 'Safety Checklist',
    tags: ['Flutter', 'Dart', 'Android Studio', 'Firestore'],
    oneLiner: 'Paper logs do not sync. This one does.',
    body:
      'Paper inspection logs get lost, are hard to read and cannot be audited. Our team of four replaced them with Safety Watch, a Flutter app where operators run each workstation check on their phone and supervisors review every report as it arrives. Firebase handles sign-in, and the role saved in Firestore decides which side of the app each person sees.',
    year: '2025',
    role: 'Software Engineering · Team of 4',
    hue: 45,
    motif: 'check',
    showcase: 'photos',
    shots: [
      { src: sc1, still: true, caption: 'Safety Watch', group: 'Overview', about: 'A mobile app that replaces paper safety logs. Operators inspect their workstation on the phone, and supervisors see every report the moment it is submitted. I worked on the software analysis and development.' },
      { src: sc2, frame: 'phone', caption: 'One login, two roles', group: 'App', about: 'Everyone signs in on the same screen with Firebase Authentication. The toggle sets whether they are an operator or a supervisor, and the app opens the matching dashboard.' },
      { src: sc3, frame: 'window', file: 'Inspection flow', diagram: true, caption: 'How an inspection works', group: 'Design', about: 'The operator picks a workstation and goes through its checklist. A passing item is marked safe, but a failing one asks for a photo and a note before the report can be submitted.' },
      { src: sc4, frame: 'window', file: 'auth_gate.dart', caption: 'Routing by role', group: 'Code', about: 'The app listens to the sign-in state. Once someone is signed in, it reads their role from Firestore and sends them to the supervisor or operator dashboard, so nobody lands on the wrong side.' },
      { src: sc5, frame: 'window', file: 'login_screen.dart', caption: 'Saving the role', group: 'Code', about: 'After signing in, the app looks for the user in Firestore. On the very first login it creates their record with the role picked on the toggle.' },
      { src: sc6, frame: 'phone', caption: 'Operator dashboard', group: 'App', about: 'Operators start their daily safety check from one button.' },
      { src: sc7, frame: 'phone', caption: 'New inspection', group: 'App', about: 'The operator chooses the workstation, switches each check on or off, adds photo evidence and notes, then submits the report.' },
      { src: sc8, frame: 'window', file: 'new_inspection.dart', caption: 'Submitting a report', group: 'Code', about: 'Each report is saved to Firestore with the workstation, a server timestamp, every check result and the notes. A report with a failed item is saved as Open instead of Pass.' },
      { src: sc9, frame: 'phone', caption: 'Supervisor dashboard', group: 'App', about: 'Supervisors see how many issues are still open and every report, newest first. The list updates live from Firestore, with no refresh needed.' },
      { src: sc10, frame: 'phone', caption: 'Reviewing a report', group: 'App', about: 'Opening a report shows the photo, which checks passed or failed and the operator\'s notes. Once the problem is fixed, the supervisor marks the issue as resolved.' },
      { src: sc11, frame: 'window', file: 'Project plan', diagram: true, caption: 'Six phases, one plan', group: 'Planning', about: 'We worked in an Agile way across six phases, from planning and requirements to design, development, testing and the final report. Development took the longest stretch.' },
    ],
  },
  {
    no: '07',
    title: 'Staff Calendar Management System',
    short: 'Staff Calendar',
    tags: ['JavaScript', 'HTML & CSS', 'Supabase', 'EmailJS'],
    oneLiner: 'Built so the people using it never have to touch the code.',
    body:
      'Talentbank set a build challenge to evaluate candidates, and I chose to build a full-year career fair calendar for their events team. Staff who do not code can add, edit, cancel or reschedule fairs from an admin page, and the public calendar updates straight away. It also warns about venue clashes, emails the person in charge the day before each fair, and syncs every change to Supabase.',
    year: '2026',
    role: 'Talentbank build challenge',
    hue: 330,
    motif: 'grid',
    showcase: 'photos',
    shots: [
      { src: st1, still: true, caption: 'Talentbank Career Fairs', group: 'Overview', about: 'A full-year calendar of Talentbank career fairs, built for their build challenge. Visitors see every fair, and the events team runs it all from an admin page without touching code.' },
      { src: st2, frame: 'window', file: 'Public calendar', caption: 'The calendar', group: 'Public site', about: 'Pick a year and month to see that month\'s fairs marked on the calendar. The Upcoming fairs panel always shows what is next, whatever month is open.' },
      { src: st3, frame: 'window', file: 'Agenda', caption: 'Agenda and filters', group: 'Public site', about: 'Below the calendar, every fair in the month is listed with its venue, time and registrations. Filters show only open, fully booked, cancelled or completed fairs.' },
      { src: st4, frame: 'window', file: 'Event details', caption: 'Event details', group: 'Public site', about: 'Each fair opens into its details: dates, venue, employers and how many spots are left. Visitors can register to attend, and employers can sign up for a booth.' },
      { src: st5, frame: 'window', file: 'Events team login', caption: 'Events team login', group: 'Admin', about: 'The events team signs in to reach the admin page. It is a simple shared login for the prototype, not production security.' },
      { src: st6, frame: 'window', file: 'Manage events', caption: 'Manage events', group: 'Admin', about: 'Every fair in one table, sortable by date, name or registrations. Staff can edit, cancel, mark it full or remind the person in charge with one click, and export everything as CSV for audits.' },
      { src: st7, frame: 'window', file: 'Add event', caption: 'Adding a fair', group: 'Admin', about: 'A form instead of code. If the new dates overlap another fair at the same venue, a warning appears before it is saved.' },
      { src: st8, frame: 'window', file: 'app.js', caption: 'Spotting clashes', group: 'Code', about: 'Two fairs clash when their dates overlap. If they are also at the same venue it is a venue conflict, otherwise candidates are just warned they may have to choose.' },
      { src: st9, frame: 'window', file: 'app.js', caption: 'Status worked out for you', group: 'Code', about: 'Staff never set a status by hand. A fair is cancelled, completed once its end date passes, or fully booked when registrations reach capacity.' },
      { src: st10, frame: 'window', file: 'app.js', caption: 'Day-before check', group: 'Code', about: 'When the calendar opens, it looks for fairs that start tomorrow and have a person in charge who has not been reminded yet.' },
      { src: st11, frame: 'window', file: 'app.js', caption: 'The reminder email', group: 'Code', about: 'EmailJS sends the person in charge the fair\'s title, date, venue and time. The sent time is saved so nobody gets the same reminder twice.' },
      { src: st12, frame: 'window', file: 'app.js', caption: 'Syncing with Supabase', group: 'Code', about: 'Every change is saved to Supabase as well as the browser, so the whole team sees the same calendar. An empty table is filled from the local copy on first load.' },
      { src: st13, frame: 'phone', caption: 'On a phone', group: 'Public site', about: 'The calendar and upcoming fairs stack into one column on a phone.' },
    ],
  },
  {
    no: '08',
    title: 'Phonebook: BST and Hash Map',
    short: 'Phonebook',
    tags: ['C++', 'Binary Search Tree', 'Hash Map', 'Data Structures'],
    oneLiner: 'A tree for order, a hash map for speed.',
    body:
      'A menu-driven contact manager in C++ that stores every contact in two structures at once. A binary search tree keeps the list in alphabetical order, and a hash map finds any name straight away. Each covers what the other is bad at. Built as a six-person project for the Data Structures and Algorithms course at UTHM.',
    year: '2025',
    role: 'Six-person project',
    hue: 190,
    motif: 'tree',
    showcase: 'photos',
    shots: [
      { src: pb1, still: true, caption: 'Phonebook in C++', group: 'Overview', about: 'A contact manager that runs in the terminal. Every contact is stored in a binary search tree and a hash map at the same time, so listing and searching are both fast.' },
      { src: pb2, frame: 'window', file: 'Design', diagram: true, caption: 'One contact, two structures', group: 'Design', about: 'The tree keeps contacts in alphabetical order, so displaying them needs no sorting. The hash map jumps straight to a name for search and edit. Both are updated together on every change.' },
      { src: pb3, frame: 'window', file: 'Terminal', caption: 'The menu', group: 'Running it', about: 'Saved contacts load when the program starts. Option 5 lists them A to Z, straight from a walk through the tree.' },
      { src: pb4, frame: 'window', file: 'Terminal', caption: 'Adding a contact', group: 'Running it', about: 'Phone numbers are checked before they are saved. Letters are rejected, and the number must have 7 to 15 digits. The new contact lands in its alphabetical spot.' },
      { src: pb5, frame: 'window', file: 'Terminal', caption: 'Search with a fallback', group: 'Running it', about: 'An exact name is found through the hash map, whatever its capital letters. If there is no exact match, it lists names that start with what you typed.' },
      { src: pb6, frame: 'window', file: 'Terminal', caption: 'Edit and remove', group: 'Running it', about: 'Editing shows the current number before changing it. Removing a contact takes it out of the tree and the hash map together.' },
      { src: pb7, frame: 'window', file: 'Terminal', caption: 'Saved in order', group: 'Running it', about: 'Contacts are saved automatically on exit. The file comes out already sorted, because it is written by walking the tree.' },
      { src: pb8, frame: 'window', file: 'PhoneBook.cpp', caption: 'Inserting into both', group: 'Code', about: 'A new contact walks down the tree to its alphabetical spot. If the name already exists it is updated instead of duplicated, then the hash map is updated with the same lowercase key.' },
      { src: pb9, frame: 'window', file: 'PhoneBook.cpp', caption: 'Removing from the tree', group: 'Code', about: 'The three classic cases. A node with no child or one child is spliced out. A node with two children takes the place of the next name in order, so the tree stays sorted.' },
      { src: pb10, frame: 'window', file: 'PhoneBook.cpp', caption: 'Lookup and partial search', group: 'Code', about: 'Exact search is a single hash map lookup. Partial search walks the tree in order and keeps names that start with the text, so the results are already alphabetical.' },
      { src: pb11, frame: 'window', file: 'PhoneBook.cpp', caption: 'Checking phone numbers', group: 'Code', about: 'Only digits, spaces, dashes and a plus sign are allowed, with 7 to 15 digits in total.' },
      { src: pb12, frame: 'window', file: 'Complexity', diagram: true, caption: 'Cost of each operation', group: 'Analysis', about: 'Search runs in O(L) on average thanks to the hash map. The weak spot is a tree built from names that are already sorted, which turns it into a list. A self-balancing tree would be the next step.' },
    ],
  },
]

/** Slides that have a real picture. */
export const pics = (p: Project) => (p.shots ?? []).filter((s): s is Shot & { src: string } => !!s.src)

export const stack: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Dart'] },
  { group: 'Frontend', items: ['React', 'Flutter', 'HTML', 'CSS', 'Three.js'] },
  { group: 'Data & Cloud', items: ['SQL', 'MySQL', 'Firebase', 'Supabase', 'Cloud Firestore', 'AWS'] },
  { group: 'AI & ML', items: ['YOLOv8/v9', 'Random Forest', 'Decision Tree', 'Roboflow', 'Amazon SageMaker AI', 'Gradio'] },
  { group: 'Generative AI', items: ['OpenAI API', 'Amazon Bedrock', 'Ollama', 'RAG', 'Vector Embeddings', 'AI Agents', 'Prompt Engineering', 'Pydantic'] },
  { group: 'Engineering & Networking', items: ['MATLAB', 'Verilog', 'Proteus', 'ECAD', 'Cisco Packet Tracer', 'Wireshark', 'eNSP', 'PuTTY'] },
]

export const experience = [
  {
    when: '2025 · Jul – Oct',
    role: 'Technical Operations Intern — Maintenance',
    org: 'Media Prima Berhad',
    body:
      'Supported live national broadcasts including Anugerah Melodi with zero service disruption. Performed network switch resets over PuTTY and verified full restoration across all input parameters. Audited switch port connectivity and ran bandwidth distribution testing to confirm stable delivery during live production windows.',
  },
  {
    when: '2022 · Mar – Aug',
    role: 'Technical Operations Intern — Maintenance',
    org: 'Media Prima Berhad',
    body:
      'Supported the live broadcast of Anugerah Juara Lagu and Hari Raya Aidilfitri programming with zero downtime. Diagnosed and resolved unstable signal issues across multiple departments, working alongside the maintenance team on live event setup.',
  },
]

export const education = [
  { when: '2023 – 26', where: 'UTHM', what: 'B.Eng. (Hons) Computer Engineering', sub: 'Universiti Tun Hussein Onn Malaysia' },
  { when: '2019 – 22', where: 'Politeknik Port Dickson', what: 'Diploma in Electronic Engineering (Communication)', sub: '' },
  { when: '2014 – 18', where: 'Secondary education', what: 'PT3 · SPM', sub: '' },
  { when: '2008 – 13', where: 'Primary education', what: 'UPSR', sub: '' },
]

export const awards = [
  {
    medal: 'Gold',
    title: 'Final Year Project Industry Award',
    event: 'FKEE FEST 2026, Universiti Tun Hussein Onn Malaysia',
    date: 'June 2026',
    extra: [] as string[],
    project: 'Hospital Queue Management System',
    verify: undefined as string | undefined,
    body:
      'An Android application built in Flutter, backed by a Supabase database and a Random Forest regression model that predicts patient waiting times in government clinics.',
  },
  {
    medal: 'Gold',
    title: 'Integrated Design Project Showcase Day',
    event: 'Faculty of Electrical and Electronic Engineering, UTHM',
    date: 'January 2026',
    extra: ['2nd place in Agriculture, from 10+ competing teams', 'Team of 5'],
    project: 'AI-Integrated Smart Irrigation',
    body:
      'An IoT irrigation prototype running on an ESP32, automating watering from soil moisture readings and using a Decision Tree model to anticipate local weather.',
  },
  {
    medal: 'AWS',
    title: 'Generative AI Foundations',
    event: 'AWS Academy Graduate · Training Badge',
    date: 'October 2026',
    extra: ['12 course hours'],
    project: 'Certification',
    body: 'Completed the AWS Academy Generative AI Foundations course, with a digital badge issued and verified through Credly.',
    verify: 'https://www.credly.com/badges/82559024-aa60-4380-9313-5ca07e536b7a',
  },
  {
    medal: 'AI',
    title: 'AI Ready Malaysia: Student Edition',
    event: 'Pepper Labs × AVPN, supported by Google.org and ADB',
    date: 'October 2026',
    extra: ['10 learning hours'],
    project: 'Certification',
    body: 'A programme on AI literacy, productivity and responsible use of AI, covering generative AI in action, prompt engineering, AI governance and ethics, and agentic AI.',
    verify: 'https://pepper-s-site-1c7b.thinkific.com/certificates/xyxsacjmdk',
  },
  {
    medal: 'AI',
    title: 'AI For MY Future',
    event: 'Microsoft × Pepper Labs',
    date: 'October 2026',
    extra: ['AI Basics · Generative AI · Microsoft Copilot', 'Responsible AI · AI Inclusivity'],
    project: 'Certification',
    body: 'A Microsoft-backed programme on AI fundamentals and generative AI, including everyday use of Microsoft Copilot and building AI responsibly and inclusively.',
    verify: 'https://pepper-s-site-1c7b.thinkific.com/certificates/qifjm6ureq',
  },
  {
    medal: 'AI',
    title: 'AI Ready Malaysia: Education Workforce Edition',
    event: 'Pepper Labs × AVPN, supported by Google.org and ADB',
    date: 'October 2026',
    extra: ['10 learning hours'],
    project: 'Certification',
    body: 'The education workforce track of AI Ready Malaysia, on applying AI productively and responsibly, from generative AI and prompt engineering to governance, ethics and agentic AI.',
    verify: 'https://pepper-s-site-1c7b.thinkific.com/certificates/kdvj1nxb3b',
  },
]

export const links = {
  email: 'amirulfahmiii920@gmail.com',
  linkedin: 'https://www.linkedin.com/in/amirul-fahmi-907766389',
  github: 'https://github.com/amirulfahmiii920-beep',
}

export const nav = [
  { id: 'about', label: 'About', no: '01' },
  { id: 'work', label: 'Work', no: '02' },
  { id: 'stack', label: 'Toolkit', no: '03' },
  { id: 'experience', label: 'Experience', no: '04' },
  { id: 'education', label: 'Education', no: '05' },
  { id: 'awards', label: 'Awards', no: '06' },
  { id: 'contact', label: 'Contact', no: '07' },
]
