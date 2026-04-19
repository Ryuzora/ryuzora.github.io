---
title: "Architecting WatchLog: Next.js Meets Laravel"
date: "2026-04-19"
type: "Project"
category: "Software"
tags:
  - "nextjs"
  - "laravel"
  - "architecture"
thumbnail: "/images/image1.jpeg"
---

# Project Structure for WatchLog

![hello](/images/image1.jpeg)
For my final semester project, I'm building **WatchLog**—a mobile-first application designed to track and log series, films, and Manhwa reading progress. 

Instead of dealing with a monolithic setup, I've decided to decouple the architecture:

### The Backend: Laravel
Laravel is handling the core API, user authentication, and the database schema. The Eloquent ORM makes it incredibly easy to manage the many-to-many relationships between users, series, and watch statuses. 

### The Frontend: Next.js
The user interface is built with Next.js and styled heavily with Tailwind CSS. By utilizing Server Components and the App Router, the initial load times for the dashboard are significantly reduced. 

This decoupling not only makes the codebase cleaner but also allows me to easily swap out the web frontend for a native Android application later using Jetpack Compose if I decide to expand the project.