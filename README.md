# 📡 StatusMonitor --- Portfolio Services Status

<p align="center">
  <img src="https://status.mathszoke.com/banner.png" alt="Portfolio Banner" width="800"/>
</p>

<p align="center">
    <b>
        Service status dashboard built with .NET + React to monitor
        the availability and latency of all portfolio‑related
        services.
    </b>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white"/>
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
    <img src="https://img.shields.io/badge/Fluent%20UI-0078D4?style=for-the-badge&logo=microsoft&logoColor=white"/>
    <img src="https://img.shields.io/badge/Azure%20App%20Service-0089D6?style=for-the-badge&logo=microsoftazure&logoColor=white"/>
    <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white"/>
</p>

------------------------------------------------------------------------

## 🧠 About the Project

This service provides a **real‑time dashboard** that checks the health,
latency, and availability of all projects from my portfolio ecosystem.

It acts as a lightweight monitoring tool that centralizes:

-   Endpoint health checks
-   Latency measurement
-   Auto‑status classification (*Active*, *LowActivity*, *Inactive*)
-   Single‑project refresh
-   Global refresh
-   Timestamped updates

Everything is exposed via a simple API and rendered in a minimal
dashboard built with React + Fluent UI.

------------------------------------------------------------------------

## ⚙️ Core Stack

  Layer                Technologies
  -------------------- --------------------------
  **Frontend**         React + Fluent UI + Vite
  **Backend**          .NET 9 Minimal API
  **Database**         PostgreSQL (EF Core)
  **Infrastructure**   Azure App Service

------------------------------------------------------------------------

## 🧩 Project Structure

    src/
     ├─ StatusProjects.AppHost      → .NET Aspire Application Host
     │
     ├─ StatusProjects.Api/          → .NET Minimal API
     │                                 - Endpoints: getStatusProjects, refreshProject
     │                                 - Health checks, DI, HttpClientFactory
     │                                 - Saves last latency/status to DB
     │                                 - Database migrations (EF Core)
     │
     └─ statusprojects.web/          → React + Vite + Fluent UI
                                       - Dashboard UI
                                       - Global refresh + per‑project refresh
                                       - Per‑card last updated timestamps

------------------------------------------------------------------------

## 🌟 Key Features

-   Real‑time project monitoring
-   Latency‑based status classification
-   Global and per‑project refresh
-   Persistent status storage on DB
-   Optimized UI using Fluent UI components
-   Fully responsive
-   Deployable to Azure App Service and Github pages

------------------------------------------------------------------------

## 🎨 Dashboard UX

The dashboard uses:

-   Fluent UI cards
-   Progress bars for service health
-   Visual color coding per status
-   Per‑project update timestamps

All components are styled using `makeStyles`, keeping a consistent
professional interface.

------------------------------------------------------------------------

## 🌐 Live Demo

🔗 **https://status.mathszoke.com**

------------------------------------------------------------------------

## 📫 Contact

📧 Email: **matheusszoke@gmail.com**\
💼 LinkedIn: **https://linkedin.com/in/matheusszoke**

------------------------------------------------------------------------

<p align="center">
    <sub>
        Made with 💚 by <strong>Matheus Szoke</strong>
    </sub>
</p>
