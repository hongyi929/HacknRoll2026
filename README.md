# Project Details
Lenno is a webapp that generates waypoints near you, where you can embark on quests to learn more about the places near you and connect with nature.


<div align="center">

| Get started with a Waypoint | Begin Journey | AI Scoring |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/8e514ec4-014c-453a-9617-2751603876cf" width="250" /> | <img src="https://github.com/user-attachments/assets/e556d77b-0d73-4263-a322-f891a3cdc350" width="250" /> | <img src="https://github.com/user-attachments/assets/6aa6cc29-bb66-4c77-8fab-941ab01947d3" width="250" /> |

</div>

<p>Devpost Link: https://devpost.com/software/lenno</p>

## Inspiration
We stumbled across geocaching which was a scavenger hunt app where the user had to find a specific item with an attached hint, and we thought it would be cool to have a similar app where you could do something similar but at your own convenience, at any place. 

## What it does
Lenno offers 2 types of discovery options. Firstly, users can choose to embark on a scavenger hunt on a predefined waypoint on a map, or users can choose to embark on a quest at their current GPS location. After the user embarks on that, the location details are passed to an AI LLM that analyzes the location, and generates 3 quests for the user to take a picture of, specifically relevant to that location. When the user uploads the image, the AI will then grade the image on accuracy to location and to the quest requirements. When the user gets a score above 80 for all 3 quests, the hunt is complete. 

## How we built it

We used Next.js, React and Tailwind CSS for the frontend, Firebase for the storing of images and data of different waypoints, Google Maps API and Google Gemini API for the display of maps and usage of AI to generate quests and grade the images.

## Challenges we ran into
We faced difficulties in completing all our desired features, which included a photo collage on region completion, endless-GPS-hunt mode where you could start a quest at any place, and a place to view waypoint completion histories. On hindsight, using an AI with Grounding with Google Maps would have also made the AI grading and quest-generation more accurate.

## Accomplishments that we're proud of
This was our first time all of us collaborated and used these tools, so we're pretty happy with how we adapted to the situation and improvised the splitting of the work. 

## What we learned
To come up with a more structured plan before beginning code as that led to more delays than desired

## What's next for Lenno
We want to continue building it further in the future to learn more and just to see how far it could go, as we think it could be a good digital alternative to get people to become more active and in-touch with nature. Exploring different gamification concepts to get people excited about Lenno would be a net positive for the community!



# Setup
Frontend:
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
