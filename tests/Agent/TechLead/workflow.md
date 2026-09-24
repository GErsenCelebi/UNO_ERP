```mermaid
graph TD
    PO[PO JSON Backlog] -->|Input| TL(Tech Lead)
    style TL fill:#cc99ff,stroke:#333,stroke-width:2px;
    
    TL -->|Tech Plan + Backlog| BD(Backend Developer)
    TL -->|Test Scaffold + Backlog| QA(QA Automation)
    
    style BD fill:#99ff99,stroke:#333;
    style QA fill:#ffcc99,stroke:#333;
```
