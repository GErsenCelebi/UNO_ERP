```mermaid
graph TD
    TL[Tech Lead Scaffold] -->|Input| QA(QA Manager)
    US[User Story] -->|Input| QA
    
    style QA fill:#ffcc99,stroke:#333,stroke-width:2px;
    
    QA -->|Test Cases| BD[Backend Developer]
    BD -->|Implementation Code| QA
    QA -->|Bug Reports| BD
    QA -->|Approval| SM[Scrum Master]
    
    style BD fill:#99ff99,stroke:#333;
    style SM fill:#ffcc99,stroke:#333;

    Responsible of generating test cases and test plans for each US on github and validating every single artifact before closed either with manual (ideally) with automated test is main responsibility
```
