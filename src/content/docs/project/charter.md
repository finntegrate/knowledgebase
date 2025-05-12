---
title: Project Charter
description: Finntegrate Project Charter
---

# Finntegrate Project Charter

## Project Vision

Finntegrate aims to create an accessible, multilingual support system for immigrants to Finland. It will help them navigate complex bureaucratic processes and connect with essential resources and services, significantly reducing common challenges. By leveraging AI technology, Finntegrate will provide personalized guidance tailored to each immigrant's specific situation, language, and needs, making them feel understood and catered to.

## Problem Statement

Immigrants to Finland face numerous challenges, including:

* **Language barriers** when accessing critical information  
* **Complex and frequently changing bureaucratic processes**, particularly with the Migri (Finnish Immigration Service)  
* **Administrative literacy challenges** – difficulty understanding bureaucratic structures, terminology, and processes  
* **Digital literacy barriers** affecting the ability to navigate online services  
* **Scattered information** across multiple websites and resources (Migri, Kela, Vero, DVV, TE-services/Municipalities)  
* **Service fragmentation** across government agencies and municipalities  
* **Time-consuming information gathering** requiring extensive research  
* **Qualification recognition issues** for foreign credentials  
* **Stress and uncertainty** affecting mental wellbeing during transition

These challenges can lead to delays in processing, misunderstandings, missed opportunities, and unnecessary hardship for immigrants. 

Additionally, these challenges create significant "failure demand" for Finnish government agencies \- support requests that arise because immigrants cannot achieve their goals using existing resources. This failure to achieve goals generally occurs when:

* Information is structured around bureaucratic processes rather than immigrant concerns  
* Natural language search capabilities are limited (requiring exact keywords)  
* Content is siloed between organizations, forcing immigrants to piece together information  
* Service interfaces are designed from the perspective of agencies rather than users

This “failure demand” increases government agencies' costs while creating frustration for immigrants. However, with Finntegrate's approach, we aim to significantly reduce this demand, fostering optimism for immigrants and government agencies.

## Failure Demand Reduction

Finntegrate aims to reduce "failure demand" \- support requests that arise because users cannot achieve their goals through existing resources. Our approach includes:

* **Natural Language Interface**: Allowing immigrants to ask questions in their own words rather than requiring exact keywords or bureaucratic terminology  
* **User-Centric Information Organization**: Structuring information around immigrant needs and concerns rather than organizational processes  
* **Cross-Organizational Knowledge Integration**: Breaking down information silos between government agencies  
* **Dual-Audience Support**: Potentially serving both immigrants and government support staff who need to access information outside their organizational silo

By reducing the “failure demand”, Finntegrate can provide significant value to immigrants and government agencies. For immigrants, it offers a streamlined and personalized support system, while for government agencies, it reduces costs and frustration, creating a compelling case for adoption and partnership.

## Strategic Opportunities

* Addressing information fragmentation through centralized retrieval  
* Enhancing accessibility through multilingual interfaces and simplified language  
* Simplifying navigation of bureaucratic processes  
* Connecting users to the right resources within the existing ecosystem  
* Reducing "failure demand" in government services  
* Supporting cross-organizational knowledge sharing  
* Aligning with Finnish government AI initiatives

## Project Objectives and Approach

### Primary Objectives

1. Create a multilingual AI assistance tool that guides immigrants through Finnish bureaucracy by connecting them with existing resources  
2. Reduce barriers to successful integration by providing clear, accessible information in users' native languages  
3. Help immigrants find and navigate official resources more efficiently  
4. Build a portfolio of GenAI prototypes that demonstrate our capabilities in this domain

### Approach

* **Lean R\&D**: Focus on working software over comprehensive documentation  
* **Rapid Prototyping**: Create small, educational prototypes that can be replaced or improved  
* **Just-in-Time Learning**: Acquire skills and knowledge as needed during development  
* **Leveraging Personal Experience**: Build on our own experiences as migrants in Finland  
* **Community-Based Testing**: Use the Tribe Tampere network for feedback and testing

## Scope Definition and MVP Boundaries

### Minimum Viable Product

* **Core Function**: Chat interface using Retrieval Augmented Generation (RAG)  
* **Initial Focus**: Migri-related information and processes  
* **Features**:  
  * Multilingual chat interface (starting with English, expanding based on capacity)  
  * RAG system with links to official resources  
  * Basic metadata to improve retrieval relevance  
  * Simple logging for continual improvement  
  * Source citations and links to official pages

### Secondary Objectives (After MVP)

* Multi-agent orchestration for specialized assistance  
* Migri interview preparation simulation  
* Integration with additional knowledge sources beyond Migri  
* Personalized information discovery based on immigrant profile/situation  
* Progressive web app capabilities for improved accessibility

### Explicitly Out of Scope

* Integration with official systems or APIs  
* Document translation services  
* Automated form completion  
* Custom wizards for all processes  
* Legal advice or case-specific predictions  
* Processing or storing personal identifiable information (PII)  
* Features requiring sensitive data, like application numbers or personal codes  
* Case status tracking or application monitoring  
* Providing definitive immigration decisions or eligibility predictions

### Information Categories to Include

* Residence permit processes (links to migri.fi)  
* Reference to existing services like finnishcourses.fi  
* Community resources and support groups  
* Links to established housing and job search platforms  
* Basic information about banking and other practical needs  
* Key stakeholder organizations and their roles  
* Critical registration processes and administrative codes, including:  
  * DVV registration (Digital and Population Data Services Agency)  
  * Personal identity code (henkilötunnus) \- essential for accessing most Finnish services  
  * Municipality of residence registration (kotikunta) \- required for accessing municipal services  
  * Tax identification procedures (tax card/verokortti) \- needed for employment

## Stakeholders and Community

* **Primary Users**: Immigrants to Finland (with initial focus on international professionals/students)  
* **Secondary Users**: Support workers at government agencies seeking cross-organizational information  
* **Strategic Partners**: Government agencies like Migri (conservative approach to relationship development)  
* **Community Resources**: Tribe Tampere network for testing and feedback  
* **Public Resources**: Official websites (migri.fi, infofinland.fi, suomi.fi, kela.fi, vero.fi, etc.)  
* **Project Team**: 2 part-time collaborators with migrant experience

## Success Indicators

### Technical Success

* Functional RAG system with relevant retrievals  
* Multilingual support implementation  
* Data refresh pipeline established  
* Open-source repository with documentation  
* Proper security and privacy protections  
* Clearly defined API boundaries

### User Success

* Positive feedback from test users  
* Demonstrated time savings in finding information  
* Reported reduction in confusion about processes  
* Successful navigation to appropriate official resources  
* Clear understanding of system capabilities and limitations

### Project Success

* Portfolio of working GenAI prototypes  
* Documented learning outcomes  
* Technical skills development for team members  
* Foundation for potential future funded development  
* Avoidance of issues that affected previous tools like Migri's Kamu chatbot

## Project Methodology: Agile Prototyping

### Discovery Phase (✓ Mostly Completed)

* Catalog existing public resources and information sources  
* Map key immigrant information needs based on personal experience  
* Set up development environment and collaboration tools  
* Research previous digital initiatives in the Finnish immigration space

### Prototyping Cycles (Current Focus)

* **Core RAG System (✓ Completed)**  
    
  * Web scraping official resources  
  * Building a vector database with relevant metadata  
  * Implementing retrieval mechanisms  
  * Creating a basic chat interface  
  * Adding initial multilingual support


* **Enhanced Capabilities (Current Focus)**  
    
  * Multi-agent system development  
  * Specialized interview simulation agents  
  * Expanded knowledge base integration  
  * Improved multilingual capabilities  
  * Frontend/backend separation for scalability  
  * Developing an orchestration platform for RAG data updates (scheduled crawlers)  
  * User testing and feedback implementation


* **Organizational Development (Current Focus)**  
    
  * Finalize project charter and strategic documentation  
  * Develop a structured GitHub backlog and issue tracking  
  * Create online presence (project website)  
  * Establish project identity and documentation standards  
  * Outreach to potential partner organizations, such as International House Tampere, etc.  
  * Create and distribute a user survey for needs assessment

### Testing & Refinement (Upcoming)

* Gather feedback from the Tribe Tampere community  
* Refine based on user feedback  
* Document limitations and future opportunities  
* Prepare final demonstration and documentation

## Revised Timeline

| Phase                      | Duration  | Focus                                                                               | Status           |
| :------------------------- | :-------- | :---------------------------------------------------------------------------------- | :--------------- |
| Setup & Discovery          | 1 week    | Resource mapping, environment setup, and initial requirements                       | Mostly Completed |
| Core RAG Development       | 1 week    | Web scraping, vector database, basic retrieval, chat interface                      | Completed        |
| Enhanced Features          | 2-3 weeks | Multi-agent system, expanded knowledge base, specialized agents, data orchestration | In Progress      |
| Organizational Development | 2 weeks   | Project charter, backlog development, online presence, stakeholder outreach         | In Progress      |
| Architecture Refinement    | 2 weeks   | Frontend/backend separation, API development, improved UI                           | Planned          |
| Testing & User Research    | 2 weeks   | User survey, feedback gathering, and community testing                              | Planned          |
| Documentation & Refinement | 1 week    | Final documentation and handover preparation                                        | Planned          |

## Resource Approach

### Team Structure

**2 part-time collaborators** sharing responsibilities across:

* Product vision and requirements  
* Technical development  
* User testing coordination  
* Documentation

### Technical Resources

* Open-source technologies (RAG frameworks, LLM integrations)  
* Public cloud resources (minimal cost)  
* Existing public datasets and information  
* GitHub for version control and documentation  
* Google Workspace for collaboration  
* Modern web frameworks for production-ready deployment

### Community Resources

* Tribe Tampere network for feedback  
* International House Tampere and other official support organizations  
* Personal networks within immigrant communities  
* Public information from official Finnish sources

## Lessons from Previous Digital Initiatives

* **Focus on core value**: Prioritize reliable information retrieval rather than attempting potentially fragile predictive functions  
* **Build and maintain trust**: Prioritize accuracy, transparency, and reliability in all information provided  
* **Manage expectations**: Communicate the tool's capabilities and limitations  
* **Avoid sensitive data handling**: Be cautious with features involving personal data  
* **Continuous improvement**: Plan for ongoing development based on user feedback and changing needs

## Constraints and Assumptions

### Constraints

* Limited time availability (part-time, spare-time project)  
* No dedicated budget for development or contracted services  
* Reliance only on publicly available information  
* No official partnerships or special access to systems

### Assumptions

* Sufficient public information is available for RAG implementation  
* Team members can allocate consistent part-time hours  
* Community members will provide feedback  
* Open-source tools can support our technical requirements  
* Privacy and security by design will increase user trust and adoption

## Risk Considerations

| Risk                      | Impact | Mitigation Approach                                                                       |
| :------------------------ | :----- | :---------------------------------------------------------------------------------------- |
| Limited time availability | High   | Strict scope control, timeboxed sprints, focus on learning outcomes                       |
| Technical challenges      | Medium | Start with simpler prototypes, build progressively, and leverage open communities         |
| Information accuracy      | High   | Clear disclaimers, link to official sources, regular data refreshes                       |
| User adoption barriers    | Medium | Leverage personal networks, focus on the most pressing needs first                        |
| Scope expansion           | Medium | Maintain a minimal viable product definition, and document future ideas separately        |
| Privacy concerns          | High   | Avoid collecting/storing PII, implement security best practices, and provide transparency |
| Outdated information      | High   | Implement regular data refresh mechanisms, clearly display last update timestamps         |

## Working Agreement

* **Communication**: Asynchronous via messaging, weekly in-person sync  
* **Development**: Individual work with regular code reviews  
* **Documentation**: Ongoing in GitHub and Google Workspace  
* **Decision Making**: Collaborative with a focus on learning outcomes  
* **Code**: Open-source with appropriate licensing

## Documentation Strategy

* **Technical Documentation**: GitHub repository with setup instructions  
* **User Documentation**: A Simple website explaining the project  
* **Learning Documentation**: Record of prototypes and outcomes  
* **Future Opportunities**: List of potential extensions or improvements  
* **Strategic Context Map**: Overview of the Finnish immigration ecosystem to guide development

## Next Steps

1. (✓) Set up a GitHub [repository](https://github.com/finntegrate/migri-assistant) and [project structure](https://github.com/orgs/finntegrate/projects/1)  
2. (✓) Catalog existing resources and information sources  
3. (✓) Create an initial data scraping and processing prototype  
4. (✓) Establish a basic RAG pipeline with test queries  
5. (✓) Build a simple chat interface prototype  
6. (In Progress) Expand the RAG pipeline to use purpose-specific chat agents  
7. (In Progress) Create a data orchestration platform for scheduled crawling and updates  
8. (In Progress) Develop project documentation and online presence  
9. (In Progress) Establish connections with potential partner organizations  
10. (Planned) Research Finnish government AI guidance and initiatives related to administrative support  
11. (Planned) Begin pragmatic outreach to strategic partners like Migri  
12. (Planned) Create and distribute a user survey for needs assessment  
13. (Planned) Develop a specialized Migri Interview Simulation prototype  
14. (Planned) Evaluate architecture for frontend/backend separation  
15. (Planned) Implement improved UI with SvelteKit  
16. (Planned) Develop a dedicated API with FastAPI  
17. (Planned) Conduct user testing and gather feedback  
18. (Planned) Document outcomes and prepare for expanded development
