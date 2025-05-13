---
title: Project Charter
description: Finntegrate Project Charter
---

# Finntegrate Project Charter

## Project Vision

Finntegrate aims to create an accessible, multilingual support system for immigrants to Finland through the lens of information science and user-centered design. Our mission is to help immigrants navigate complex bureaucratic processes by understanding their information behaviors, identifying barriers, and facilitating effective information retrieval.

Key elements of our vision:

* **Task-based information seeking** - Research-based understanding of how immigrants complete bureaucratic tasks
* **Barrier identification** - Recognizing and addressing common obstacles in information access
* **Information interaction framework** - Using established information science principles to guide system design
* **AI-enhanced personalization** - Leveraging technology to provide guidance tailored to each immigrant's specific situation, language, and information needs

## Problem Statement: Information Interaction Challenges

Immigrants to Finland face numerous information-seeking and interaction challenges that can be grouped into the following categories:

### Systemic Fragmentation
* **Fragmented information landscape** - Information scattered across multiple websites and government agencies (Migri, Kela, Vero, DVV, TE-services)
* **Complex bureaucratic processes** - Frequently changing requirements and procedures with interdependencies
* **Cross-agency information gaps** - Lack of coordination between different government services

### Access Barriers
* **Language limitations** - Insufficient information localization in languages beyond Finnish and Swedish
* **Digital navigation obstacles** - Challenges in accessing and using online government services
* **Information discovery problems** - Difficulty finding relevant information without prior system knowledge

### Cognitive Barriers
* **High cognitive load** - Need for extensive research and information synthesis across multiple sources
* **Information anxiety** - Uncertainty and stress affecting mental wellbeing during transition
* **Bureaucratic literacy challenges** - Difficulty understanding specialized terminology and administrative structures

These challenges can lead to delays in processing, misunderstandings, missed opportunities, and unnecessary hardship for immigrants. They can also result in increased workload for support workers and government agencies.

The information-related challenges stem from fundamental misalignments in information systems design:

* Information structured around bureaucratic processes rather than immigrant information tasks
* Limited natural language information retrieval capabilities (requiring exact keywords)
* Information silos between organizations, forcing immigrants to piece together complex information
* User interfaces designed from the perspective of information providers rather than information users

## Information Interaction Framework

Drawing on academic research, Finntegrate will apply established information science frameworks to address immigrant information challenges:

* **Task-Based Information Seeking**: Understanding immigrant-centered information tasks and their stages, identifying barriers at each stage, and designing solutions that support successful task completion
* **Interactive Information Retrieval**: Creating systems that allow for simple, natural dialogue between users and information resources
* **Information Behavior Studies**: Researching how immigrants actually seek, find, and use information to inform system design
* **Information Barriers Research**: Identifying and addressing contextual barriers in cross-cultural and multilingual information environments
* **User-Centered Information Design**: Developing interfaces based on immigrants' actual information needs and behaviors
* **Designing Natural Language Interfaces**: Allowing immigrants to ask questions in their own words rather than requiring exact keywords or bureaucratic terminology
* **Integrating Cross-Organizational Knowledge**: Breaking down information silos between government agencies, civic organizations, and municipalities to provide a holistic view of immigrant information needs

By applying these frameworks, Finntegrate can provide significant value to immigrants navigating the Finnish system. The user focus ensures that information is presented in ways that match how immigrants actually think about and approach their settlement tasks, rather than how agencies organize their services.

## Strategic Opportunities

Our strategic opportunities are aligned with our primary objectives (referenced in parentheses) and ordered by priority:

1. **Designing task-centered information systems** - Organizing information around immigrant tasks rather than bureaucratic processes (Objectives 3, 4)
   
2. **Enhancing multilingual accessibility** - Developing interfaces informed by cross-language information retrieval research to support diverse linguistic needs (Objectives 1, 2)
   
3. **Simplifying bureaucratic language** - Transforming complex terminology into clear, actionable information that reduces barriers to understanding (Objectives 2, 3)
   
4. **Integrating fragmented information** - Creating cohesive information pathways across siloed government services and resources (Objectives 3, 4)
   
5. **Applying information science research** - Leveraging academic frameworks in information behavior and task-based information seeking (Objectives 1, 4, 5)
   
6. **Developing proactive assistance** - Building systems that anticipate immigrant information needs based on common patterns and journey stages (Objectives 1, 3, 4)

## Project Objectives and Approach

### Primary Objectives

1. **Creating multilingual AI assistance** - Developing a tool that supports immigrants by understanding their information-seeking behaviors
2. **Reducing integration barriers** - Providing clear, accessible information in users' native languages
3. **Simplifying complex tasks** - Breaking bureaucratic processes into understandable, manageable steps
4. **Modeling information journeys** - Mapping immigrant tasks and their barriers to create effective information paths

### Secondary Objectives

* **Developing specialized agents** - Offering domain-specific assistance for complex immigrant scenarios
* **Simulating Migri interviews** - Building applicant confidence through realistic interview preparation
* **Expanding information coverage** - Integrating resources beyond Migri to provide holistic guidance
* **Personalizing guidance** - Tailoring information discovery to each immigrant's unique situation
* **Enabling offline access** - Supporting information retrieval even with limited connectivity
* **Creating visual guides** - Clarifying complex procedures with intuitive process maps

### Approach

* **Conducting User-Centered Research**: Understanding actual immigrant information behaviors while designing solutions
* **Mapping Task-Based Information Flows**: Identifying key immigrant information tasks, their stages, and common barriers
* **Applying Lean R&D Principles**: Focusing on working software over comprehensive documentation or prolonged cycles
* **Creating Rapid Prototypes**: Developing small, educational prototypes that can be replaced or improved
* **Learning Just-in-Time**: Acquiring skills and knowledge as needed during development
* **Drawing on Personal Experience**: Building on our own experiences as information users in the migrant context
* **Testing with Community Members**: Engaging the Tribe Tampere network for feedback and validation

## Scope Definition and MVP Boundaries

### Minimum Viable Product

* **Core Function**: Information interaction system using Retrieval Augmented Generation (RAG)
* **Initial Focus**: Migri-related information tasks and processes
* **Features**:
  * Task-based information organization around common immigrant information needs
  * Multilingual information retrieval interface (starting with English, expanding based on capacity)
  * RAG system with links to official information resources
  * Information task modeling with metadata to improve retrieval relevance
  * Simple logging for continual improvement of information quality
  * Source citations and links to official information sources

### Explicitly Out of Scope

* **Technical Integration**
  * Integration with official government systems or APIs
  * Case status tracking or application monitoring

* **Personal Data**
  * Processing or storing any personal identifiable information (PII)
  * Features requiring sensitive data (application numbers, personal codes)

* **Service Limitations**
  * Document translation services
  * Automated form completion or form filling

* **Content Boundaries**
  * Legal advice or eligibility predictions
  * Immigration decision forecasting
  * Case-specific recommendations

### Information Categories to Include

* Residence permit processes (links to migri.fi)
* Reference to existing services like finnishcourses.fi
* Community resources and support groups
* Links to established housing and job search platforms
* Basic information about banking and other practical needs
* Key stakeholder organizations and their roles
* Critical registration processes and administrative codes, including:
  * DVV registration (Digital and Population Data Services Agency)
  * Personal identity code (henkilötunnus) - essential for accessing most Finnish services
  * Municipality of residence registration (kotikunta) - required for accessing municipal services
  * Tax identification procedures (tax card/verokortti) - needed for employment

## Stakeholders and Community

* **Primary Users**: Immigrants to Finland as information seekers (with initial focus on international professionals/students)
* **Secondary Users**: Support workers at government agencies seeking cross-organizational information
* **Strategic Partners**: Government agencies like Migri (conservative approach to relationship development)
* **Academic Partners**: Researchers in information science and interactive information retrieval
* **Community Resources**: Tribe Tampere network for testing and feedback
* **Public Resources**: Official websites (migri.fi, infofinland.fi, suomi.fi, kela.fi, vero.fi, etc.)
* **Project Team**: 2 part-time collaborators with migrant experience

## Success Indicators

### Technical Success

* Functional information retrieval system with relevant retrievals
* Multilingual information access implementation
* Information update pipeline established
* Open-source repository with documentation
* Proper security and privacy protections
* Clearly defined API boundaries

### User Success (Based on Information Interaction Metrics)

* Positive feedback on information relevance from test users
* Demonstrated reduction in time spent on information-seeking tasks
* Reported reduction in confusion about information processes
* Successful navigation to appropriate official information resources
* Lower information anxiety and increased confidence in task completion
* Clear understanding of system information capabilities and limitations

### Project Success

* Portfolio of working GenAI prototypes grounded in information science principles
* Documented learning outcomes on immigrant information behavior
* Technical skills development for team members
* Foundation for potential future funded development
* Avoidance of issues that affected previous tools like Migri's Kamu chatbot

## Project Methodology: User-Centered Information System Design

### Discovery Phase (✓ Mostly Completed)

* Catalog existing information resources and sources
* Map key immigrant information tasks based on personal experience
* Document common barriers in immigrant information seeking
* Set up development environment and collaboration tools
* Research previous digital initiatives in the Finnish immigration space

### Prototyping Cycles (Current Focus)

* **Core Information Retrieval System (✓ Completed)**
  * Web scraping official information resources
  * Building a vector database with task-relevant metadata
  * Implementing information retrieval mechanisms
  * Creating a basic information interaction interface
  * Adding initial multilingual information support

* **Enhanced Information Capabilities (Current Focus)**
  * User task analysis and information journey mapping
  * Multi-agent system development for complex information tasks
  * Specialized information agents for specific immigrant scenarios
  * Expanded knowledge base integration across information silos
  * Improved multilingual information retrieval capabilities
  * Frontend/backend separation for scalability
  * Developing an orchestration platform for information updates (scheduled crawlers)
  * User testing of information interaction patterns

* **Organizational Development (Current Focus)**
  * Finalize project charter with information science framework
  * Develop a structured GitHub backlog and issue tracking
  * Create online presence (project website)
  * Establish project identity and documentation standards
  * Outreach to potential partner organizations, such as International House Tampere
  * Create and distribute a user survey for information needs assessment

### Testing & Refinement (Upcoming)

* Gather feedback on information design from the Tribe Tampere community
* Refine based on observed information-seeking patterns
* Document information barriers and future opportunities
* Prepare final demonstration and documentation

## Revised Timeline

| Phase                                        | Duration  | Focus                                                                                              | Status           |
| :------------------------------------------- | :-------- | :------------------------------------------------------------------------------------------------- | :--------------- |
| Setup & Information Discovery                | 1 week    | Information resource mapping, environment setup, and initial requirements                          | Mostly Completed |
| Core Information Retrieval Development       | 1 week    | Web scraping, vector database, basic retrieval, chat interface                                     | Completed        |
| Enhanced Information Features                | 2-3 weeks | Task modeling, multi-agent system, expanded knowledge base, specialized agents, data orchestration | In Progress      |
| Organizational Development                   | 2 weeks   | Project charter, backlog development, online presence, stakeholder outreach                        | In Progress      |
| Information Architecture Refinement          | 2 weeks   | Frontend/backend separation, API development, improved UI based on user research                   | Planned          |
| User Testing & Information Behavior Research | 2 weeks   | User survey, feedback gathering, and community testing                                             | Planned          |
| Documentation & Refinement                   | 1 week    | Final documentation and handover preparation                                                       | Planned          |

## Resource Approach

### Team Structure

**2 part-time collaborators** sharing responsibilities across:

* Information needs analysis and requirements
* Technical development
* User testing coordination
* Documentation

### Technical Resources

* Open-source technologies (RAG frameworks, LLM integrations)
* Public cloud resources (minimal cost)
* Existing public information sources
* GitHub for version control and documentation
* Google Workspace for collaboration
* Modern web frameworks for production-ready deployment

### Community Resources

* Tribe Tampere network for feedback
* International House Tampere and other official support organizations
* Personal networks within immigrant communities
* Public information from official Finnish sources
* Academic research on immigrant information behavior

## Lessons from Previous Digital Initiatives (Through Information Science Lens)

* **Focus on user information tasks**: Prioritize understanding real immigrant information needs and tasks
* **Build and maintain information trust**: Ensure information reliability and transparency in all responses
* **Manage information expectations**: Clearly communicate the system's information capabilities and limitations
* **Avoid sensitive information handling**: Be cautious with features involving personal data
* **Continuous information improvement**: Plan for ongoing development based on observed information behavior

## Constraints and Assumptions

### Constraints

* Limited time availability (part-time, spare-time project)
* No dedicated budget for development or contracted services
* Reliance only on publicly available information
* No official partnerships or special access to information systems

### Assumptions

* Sufficient public information is available for RAG implementation
* Team members can allocate consistent part-time hours
* Community members will provide feedback on information design
* Open-source tools can support our information retrieval requirements
* Privacy and information security by design will increase user trust and adoption

## Risk Considerations

| Risk                                          | Impact | Mitigation Approach                                                                       |
| :-------------------------------------------- | :----- | :---------------------------------------------------------------------------------------- |
| Limited time availability                     | High   | Strict scope control, timeboxed sprints, focus on learning outcomes                       |
| Technical challenges in information retrieval | Medium | Start with simpler prototypes, build progressively, and leverage open communities         |
| Information accuracy                          | High   | Clear disclaimers, link to official sources, regular information refreshes                |
| User adoption barriers                        | Medium | Leverage personal networks, focus on the most pressing information needs first            |
| Scope expansion                               | Medium | Maintain a minimal viable product definition, and document future ideas separately        |
| Information privacy concerns                  | High   | Avoid collecting/storing PII, implement security best practices, and provide transparency |
| Outdated information                          | High   | Implement regular information refresh mechanisms, clearly display last update timestamps  |

## Working Agreement

* **Communication**: Asynchronous via messaging, weekly in-person sync
* **Development**: Individual work with regular code reviews
* **Documentation**: Ongoing in GitHub and Google Workspace
* **Decision Making**: Collaborative with a focus on learning outcomes
* **Code**: Open-source with appropriate licensing

## Documentation Strategy

* **Technical Documentation**: GitHub repository with setup instructions
* **User Documentation**: A Simple website explaining the project and information capabilities
* **Learning Documentation**: Record of information behavior findings and outcomes
* **Future Opportunities**: List of potential extensions or improvements to the information system
* **Strategic Context Map**: Overview of the Finnish immigration information ecosystem to guide development

## Next Steps

1. (✓) Set up a GitHub [repository](https://github.com/finntegrate/migri-assistant) and [project structure](https://github.com/orgs/finntegrate/projects/1)
2. (✓) Catalog existing information resources and sources
3. (✓) Create an initial information scraping and processing prototype
4. (✓) Establish a basic information retrieval pipeline with test queries
5. (✓) Build a simple information interaction interface prototype
6. (In Progress) Conduct task-based analysis of immigrant information needs
7. (In Progress) Expand the RAG pipeline to use purpose-specific information agents
8. (In Progress) Create a data orchestration platform for scheduled information updates
9. (In Progress) Develop project documentation and online presence
10. (In Progress) Establish connections with potential partner organizations
11. (Planned) Research Finnish government AI guidance and initiatives related to administrative support
12. (Planned) Begin pragmatic outreach to strategic partners like Migri
13. (Planned) Create and distribute a user survey for information needs assessment
14. (Planned) Develop a specialized Migri Interview Simulation prototype based on task analysis
15. (Planned) Evaluate architecture for frontend/backend separation
16. (Planned) Implement improved UI with SvelteKit based on information interaction research
17. (Planned) Develop a dedicated API with FastAPI
18. (Planned) Conduct user testing of information-seeking patterns and gather feedback
19. (Planned) Document information behavior findings and prepare for expanded development
20. (Planned) Reach out to academic researcher(s) for potential research collaboration or advisory input

