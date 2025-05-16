---
title: Knowledge Graph Implementation for Enhanced Immigrant Support Services in Finland
description: This document outlines the technical implementation strategy for a knowledge graph system to enhance the Finntegrate project, focusing on Finnish government documentation and multilingual support.
---

# **Knowledge Graph Implementation for Enhanced Immigrant Support Services in Finland**

## **Executive Summary**

This report outlines a comprehensive strategy for the Finntegrate project to implement a knowledge graph (KG) system derived from unstructured Finnish government documentation. The primary objective is to enhance an existing Retrieval Augmented Generation (RAG) system, thereby creating a more accessible and effective multilingual support system for immigrants navigating Finland's bureaucratic landscape. The recommendations prioritize open-source technologies, maintainability by a small development team, and computational efficiency, addressing Finntegrate's specific constraints.

The proposed technical pipeline for KG construction involves several key stages: data ingestion and preprocessing of Markdown documents; advanced Finnish linguistic processing, including tokenization, lemmatization, and morphological analysis (compound splitting, case normalization) using tools like the Turku Neural Parser Pipeline and Omorfi; Named Entity Recognition (NER) leveraging fine-tuned FinBERT models (e.g., Kansallisarkisto/finbert-ner) and potentially Large Language Models (LLMs) like FinGPT; and Relationship Extraction (RE) through a hybrid approach combining rule-based methods (informed by dependency parsing) and ML/LLM techniques. Entity disambiguation and robust provenance tracking, linking extracted information back to source documents, are integral to the pipeline.

A domain-specific ontology is recommended, drawing core entities (e.g., Process, Agency, Document, Requirement) and relationships from Finntegrate's requirements and existing Finnish public service models like Suomi.fi Palvelutietovaranto (PTV) and Migri's glossary. For the KG database, Neo4j is suggested due to its maturity, Python integration, and capabilities for complex relationship querying, though RDFLib with a triple store is a viable alternative if RDF adherence is paramount. Multilingual content (Finnish, English, Swedish) will be handled by storing language-specific properties on nodes and relationships, with Helsinki-NLP's Opus-MT models available for translation needs.

The integration with the existing RAG system will be achieved through GraphRAG, employing hybrid retrieval mechanisms that combine vector similarity search with structured graph traversal. This approach promises more precise answers to complex relational queries, improved context awareness, and reduced LLM hallucinations compared to traditional vector-based RAG. Evaluation of the GraphRAG system will involve metrics assessing both the KG retrieval quality (e.g., Greval's chunk/triple evaluation) and the final generated answer quality (e.g., RAGAS framework).

For user experience, interactive and task-oriented visualizations of relevant KG subgraphs are recommended, using libraries like Cytoscape.js. Interaction patterns should combine conversational querying with visual navigation, guiding users through complex processes. A robust user feedback mechanism is crucial for the iterative refinement of both the KG and the RAG system.

The implementation roadmap is phased, beginning with foundational NLP setup and progressing through KG construction, basic RAG integration, advanced GraphRAG development, and finally, visualization and user feedback integration. This iterative approach allows for continuous improvement and adaptation to emerging needs, ensuring the Finntegrate system effectively supports immigrants in Finland.

## **Detailed Analysis**

### **I. Technical Implementation Strategy for Knowledge Graph Construction**

This section details the foundational technical plan for constructing the knowledge graph (KG). The strategy emphasizes a modular, robust, and maintainable pipeline specifically designed to process Finnish bureaucratic documentation and meet Finntegrate's operational constraints.

#### **A. Optimal Entity and Relationship Extraction Pipeline from Bureaucratic Documentation**

The transformation of unstructured Markdown documents from Finnish government agencies into a structured knowledge graph requires a carefully designed pipeline. The proposed pipeline consists of the following stages:

1. **Data Ingestion & Preprocessing:** This initial stage involves loading the Markdown files scraped from official government websites (Migri, Kela, TE-services, DVV, etc.). Text cleaning will be performed to normalize content, although significant OCR noise is not anticipated given the source format. Document segmentation is crucial; text will be chunked into manageable units (e.g., paragraphs or sections) suitable for processing by LLMs 2 or at a sentence level for traditional NLP techniques.  
2. **Linguistic Preprocessing (Finnish Focus):** Due to the morphological richness of Finnish, this stage is critical. It includes tokenization (breaking text into words/sub-words), lemmatization (reducing words to their base dictionary form), detailed morphological analysis (identifying noun cases, verb conjugations, and crucially, splitting compound words), and dependency parsing (analyzing grammatical relationships between words). Tools like the Turku Neural Parser Pipeline are well-suited for these tasks, providing output in formats like CoNLL-U that are rich in linguistic information.3  
3. **Named Entity Recognition (NER):** Core entities relevant to the immigration domain must be identified. These include Immigration Processes (e.g., residence permit application), Government Agencies (e.g., Migri), Document Types (e.g., passport), Legal Requirements, Timeline/Procedural Steps, Geographic Locations, and Administrative Codes. This can be achieved by fine-tuning pre-trained Finnish NER models (like FinBERT variants) on domain-specific data or by employing LLM-based prompting strategies.1  
4. **Relationship Extraction (RE):** Once entities are identified, the connections between them must be extracted. Examples include "Residence Permit REQUIRES Application Form X" or "Migri ISSUES Residence Permit." Bureaucratic documents often contain formal language and semi-structured elements (headings, lists) that can be exploited. A hybrid approach to RE is advisable. LLMs can be used for broader discovery of relationships.2 However, for well-defined, recurring patterns common in legal and administrative texts, rule-based systems leveraging linguistic patterns (e.g., from dependency parses) can offer higher precision and reduce the "black box" nature of pure LLM extraction, which can sometimes lack accountability.2 This combination allows for both flexibility and precision.  
5. **Entity Disambiguation/Linking:** Different textual mentions may refer to the same real-world entity (e.g., "Migri" and "Maahanmuuttovirasto," or "työlupa" and "työntekijän oleskelulupa" if they refer to the same specific permit concept in context). These need to be resolved to a single canonical representation in the KG. LLMs have shown promise in assisting with this task by understanding context and consolidating properties.2  
6. **Knowledge Graph Population:** The extracted entities (as nodes) and relationships (as edges), along with their properties (e.g., names in different languages, descriptions, URLs), are transformed into the chosen graph database's format and loaded. This step involves mapping the extracted information to the defined KG schema/ontology.7  
7. **Provenance Tracking:** To ensure traceability and maintainability, each piece of information in the KG (nodes and/or relationships) must be linked back to its source. This involves embedding identifiers such as the source Markdown filename and specific section or paragraph ID from which the information was extracted. This is more than just metadata; it should be a structural component of the graph, enabling queries about data origins.9

This staged pipeline 7 allows for modular development, where specific tools and techniques can be optimized for each step. An iterative refinement process is also envisioned. As more documents are processed and the KG grows, the extracted information can provide feedback for refining the schema and the extraction rules/prompts themselves. This adaptability is crucial for building a comprehensive and accurate KG from evolving government documentation.7

#### **B. Recommended Open-Source Tools and Libraries (Emphasis on Finnish Language Support)**

Selecting appropriate open-source tools is critical, especially given Finntegrate's resource constraints and the need for strong Finnish language support.

* **Core Finnish NLP Pipeline:**  
  * **Turku Neural Parser Pipeline (TurkuNLP):** This is a highly recommended tool for foundational Finnish NLP tasks: tokenization, lemmatization, morphological analysis (including compound word handling and case identification), and dependency parsing. It provides state-of-the-art performance for Finnish and outputs in the CoNLL-U format, which is beneficial for downstream tasks.3 The CoNLL-U output, rich with linguistic annotations, can serve as a standardized intermediate representation, streamlining the flow of data to NER and RE components.  
  * **Omorfi:** A specialized, high-precision morphological analyzer for Finnish. It excels at detailed analysis, including robust compound splitting and generation/analysis of inflected forms.13 It can be integrated to supplement the Turku pipeline where extremely fine-grained morphological detail is required.  
* **Named Entity Recognition (NER):**  
  * **Fine-tuned FinBERT (TurkuNLP / Kansallisarkisto):** Models like Kansallisarkisto/finbert-ner 5 provide a strong baseline for Finnish NER. FinBERT, developed by TurkuNLP, is a leading BERT model for Finnish.15 These models will likely require further fine-tuning on Finntegrate's specific bureaucratic corpus to accurately identify domain-specific entities (e.g., particular permit types, agency sub-units).  
  * **Large Language Models (LLMs):** Open-source LLMs, including Finnish-specific models like FinGPT 16 or other adaptable multilingual models, can be employed for zero-shot or few-shot NER. This is particularly useful for rapid prototyping or for entities not well-covered by supervised models.18  
* **Relationship Extraction (RE):**  
  * **OpenNRE:** An open-source toolkit for neural relation extraction.19 It could be trained on Finnish data if suitable annotations are created or become available.  
  * **Custom Python Scripts (leveraging spaCy/TurkuNLP output):** For rule-based RE, scripts can be developed to identify relationships based on dependency paths or syntactic patterns present in the CoNLL-U output from the Turku parser.6  
  * **LLMs (e.g., FinGPT):** LLMs can be prompted to extract relationships between pre-identified entities from text snippets.18  
* **Knowledge Graph Database:**  
  * **Neo4j:** A mature, widely-used, open-source property graph database. It offers robust Python integration (e.g., py2neo, official neo4j driver), the Cypher query language for complex relationship queries, and has growing support for LLM and GraphRAG integrations.2 Its schema flexibility is advantageous for iterative development.  
  * **RDFLib with a Triple Store (e.g., Apache Jena Fuseki, Ontotext GraphDB Free):** If strict adherence to RDF standards and formal semantics is a priority, RDFLib (a Python library for working with RDF) combined with an open-source triple store is a strong option.12 This approach uses SPARQL as the query language.  
* **GraphRAG Frameworks:**  
  * **LangChain:** A versatile framework for developing LLM-powered applications. It provides modules for document loading, chunking, interacting with knowledge graphs (including Neo4j and RDF stores), and chaining LLM calls for complex workflows like GraphRAG.11  
  * **LlamaIndex:** Specifically designed for building and querying indexed data structures for LLMs, LlamaIndex offers powerful tools for creating knowledge graph indices from various data sources, performing community detection within graphs, and implementing GraphRAG query engines.27

These tools are predominantly open-source, have Python interfaces (crucial for the small development team), and many offer specific advantages for Finnish language processing or are generally well-suited for building KG-powered RAG systems.

#### **C. Proposed Knowledge Graph Schema/Ontology for Finnish Immigration Processes**

A well-defined schema (or ontology) is the backbone of the knowledge graph, determining what information can be stored and how it can be queried. The proposed schema for Finntegrate should be tailored to represent the complexities of Finnish immigration bureaucracy.

* **Core Entity Types (Nodes):** These are derived from the project's domain and typical user queries, informed by resources like the Migri glossary 31 and the Suomi.fi Palvelutietovaranto (PTV) conceptual model.32  
  * Process: Represents bureaucratic procedures (e.g., "Residence Permit Application," "Family Reunification Process," "Citizenship Application").  
  * Agency: Government bodies involved (e.g., "Migri," "Kela," "TE-palvelut," "DVV," "Police").  
  * Document: Official papers required or issued (e.g., "Application Form X," "Passport," "Employment Contract," "Certificate of Language Proficiency").  
  * Requirement: Conditions or criteria that must be met (e.g., "Sufficient Financial Means," "Valid Health Insurance," "Language Skill Level B1").  
  * Step: Individual actions or stages within a Process (e.g., "Submit Online Application," "Attend Interview at Service Point," "Receive Decision").  
  * ServicePoint: Physical or digital locations where services are accessed (e.g., "Migri Service Point Helsinki," "Online Portal for Kela Applications").  
  * Legislation: Specific laws or regulations governing processes or requirements (e.g., "Aliens Act Section 39").  
  * UserCategory: Types of immigrants the information pertains to (e.g., "Student," "Worker," "Asylum Seeker," "Family Member of EU Citizen").  
  * InformationResource: Links to specific sections of source Markdown documents or official web pages. This is crucial for provenance.  
  * AdministrativeCode: Identifiers like personal identity code, tax number, etc.  
* **Key Relationship Types (Edges):** These define how entities are connected.  
  * HAS\_SUB\_PROCESS (Process → Process)  
  * INITIATES\_PROCESS (Document/Action → Process)  
  * REQUIRES\_DOCUMENT (Process/Step → Document)  
  * ACCEPTS\_DOCUMENT (Agency/ServicePoint → Document)  
  * HAS\_REQUIREMENT (Process/UserCategory → Requirement)  
  * FULFILLS\_REQUIREMENT (Document/UserAction → Requirement)  
  * ISSUED\_BY\_AGENCY (Document/Decision → Agency)  
  * PROCESSED\_BY\_AGENCY (Process/Application → Agency)  
  * RESPONSIBLE\_FOR\_PROCESS (Agency → Process)  
  * APPLIES\_TO\_USER\_CATEGORY (Process/Requirement → UserCategory)  
  * LOCATED\_AT (ServicePoint → GeographicLocation)  
  * PROVIDES\_SERVICE\_AT (Agency → ServicePoint)  
  * CONSISTS\_OF\_STEP, PRECEDES\_STEP, FOLLOWS\_STEP (Process → Step, Step → Step)  
  * BASED\_ON\_LEGISLATION (Process/Requirement → Legislation)  
  * REFERENCES\_INFO\_RESOURCE (Any Entity → InformationResource)  
  * MENTIONS\_ENTITY (InformationResource → Any Entity) (for general, less structured links found in text)  
* **Properties (Attributes for Nodes and Relationships):**  
  * Process: name\_fi, name\_en, name\_sv, description\_fi, description\_en, description\_sv, typical\_duration, official\_form\_id, url\_info\_page.  
  * Agency: official\_name\_fi, official\_name\_en, official\_name\_sv, abbreviation, contact\_details, website\_url, responsibilities\_summary.  
  * Document: name\_fi, name\_en, name\_sv, validity\_period\_notes, issuing\_authority\_type\_description, is\_mandatory\_for\_process\_X.  
  * Requirement: description\_fi, description\_en, description\_sv, verification\_method\_notes.  
  * InformationResource: source\_document\_filename, document\_section\_id, url, retrieved\_date.  
  * Relationships: source\_sentence (text snippet supporting the relation), extraction\_confidence (if ML/LLM derived), valid\_from\_date, valid\_to\_date.  
* **Ontology Design Principles:**  
  * **Start Simple and Iterate:** Begin with this core schema and expand it based on new information discovered during KG construction and user feedback.7  
  * **Reuse Existing Vocabularies (Cautiously):** While domain-specific terms will dominate, consider standard vocabularies like Dublin Core for generic metadata (e.g., dc:source, dc:language) if using RDF. The Suomi.fi PTV conceptual model, which includes entities like Service, Service Channel, and Organisation, should be a primary source of inspiration for structuring service-related information.32  
  * **Clarity and Unambiguity:** Define entity and relationship types clearly to avoid confusion.34  
  * **Query-Driven Design:** Ensure the schema can directly support answering the typical questions Finntegrate users will have.  
  * **Provenance as a First-Class Citizen:** The schema must explicitly model the link between extracted information and its source Markdown document and specific chunk/section. This is achieved through the InformationResource entity and its connections. This allows queries such as, "Show all information extracted from 'Migri\_ResidencePermit\_FamilyTies.md', section 'Required Documents'." This robust traceability is vital for accountability and updates.9

This proposed schema provides a solid foundation. It will evolve as the project progresses and more nuanced requirements emerge from the data and user interactions.

#### **D. Strategies for Handling Multilingual Content (Finnish/English/Swedish) in KG Construction**

Finntegrate aims to be a multilingual system. The KG must therefore effectively manage information in Finnish, English, and Swedish.

* **Representing Multilingual Literals:**  
  * **RDF-based KGs (using RDFLib):** The standard RDF approach is to use language-tagged literals. For example, the name of an agency could be stored as "Maahanmuuttovirasto"@fi, "Finnish Immigration Service"@en, and "Migrationsverket"@sv.22 RDFLib fully supports this.  
  * **Property Graphs (e.g., Neo4j):** Neo4j does not have built-in support for RDF-style language tags directly on properties. The common practice is to store different language versions as distinct properties on a node or relationship. For example, an Agency node could have properties like name\_fi: "Maahanmuuttovirasto", name\_en: "Finnish Immigration Service", name\_sv: "Migrationsverket".8 This is straightforward to implement and query.  
* **Translation Strategy:**  
  * Source documents from Finnish government agencies are primarily in Finnish, with some available in Swedish and English.  
  * If a term, description, or piece of content is not available in all three target languages within the source documents, machine translation can be employed.  
  * **Helsinki-NLP's Opus-MT models** are state-of-the-art open-source translation models with excellent support for Finnish, Swedish, and English.38 These can be integrated into the data ingestion pipeline to translate missing labels or descriptions. The quality of machine translation should be considered, and for critical information, a flag indicating "machine-translated" might be useful.  
* **Ontology Terminology:**  
  * The core URIs or internal names for entity types (e.g., finntegrate:Process) and relationship types (e.g., finntegrate:requiresDocument) in the ontology itself should be language-agnostic. The multilingual labels are primarily for human readability, user interface presentation, and multilingual search functionality.  
* **Querying and Content Presentation:**  
  * The system must support querying in any of the three languages. This means search indexes need to cover all language-specific properties.  
  * When information is retrieved, the RAG system needs to be aware of the language of the source content (stored in the KG) and the user's preferred language. If a direct translation of a content snippet is not stored, on-the-fly translation (again, potentially using Opus-MT) or presenting the original Finnish content with an option to translate could be offered. This extends multilingualism beyond just labels to the actual content provided to the user.  
* **Tooling Support:**  
  * Some knowledge graph management tools offer inherent support for multilingual views by managing a single concept with multiple language labels.42 While Finntegrate will likely build a custom solution, this principle of a unified concept with language-specific representations is key.

By implementing these strategies, the KG can effectively store and serve information in Finnish, English, and Swedish, catering to Finntegrate's diverse user base.

#### **E. Best Practices for Integrating Knowledge Graphs with Existing Vector-based RAG System**

Integrating the KG with Finntegrate's current vector-based RAG system is crucial for unlocking enhanced capabilities. The goal is to create a GraphRAG system where the KG provides structured, factual context to the LLM, complementing the semantic retrieval from vector embeddings.

* **Hybrid Retrieval Strategies:** This is the cornerstone of GraphRAG.  
  1. **Vector-Dominant with KG Enrichment:** The user's query first hits the vector database to retrieve relevant text chunks. Entities are then extracted from these chunks (or the original query). These entities are used to query the KG to fetch related information, such as process steps, dependent requirements, or involved agencies. The combined context (text chunks \+ KG facts) is then fed to the LLM.9  
  2. **KG-Dominant with Vector Refinement:** For queries that are clearly relational or entity-centric (e.g., "Compare process A and process B"), the KG might be queried first. The results from the KG (e.g., names of related documents or concepts) can then be used to perform a more targeted vector search to retrieve detailed textual explanations.  
  3. **Iterative Retrieval:** An LLM agent could decide the retrieval flow, potentially querying the vector store, then the KG, then back to the vector store with refined queries based on KG insights.11  
* **Contextual Grounding and Enrichment:** The KG provides explicit, factual relationships that can ground the LLM's responses, reducing the likelihood of hallucinations and improving accuracy.7 For instance, if a user asks about a specific permit, the KG can provide a structured list of required documents, which is more reliable than an LLM trying to synthesize this from disparate text passages alone.  
* **Enhanced Query Understanding and Rewriting:** The KG can help disambiguate entities mentioned in a user's query. For example, if a user asks about "registration," the KG can help determine if they mean DVV registration, TE-services registration, or something else, based on other entities or context in the query. This understanding can be used to rewrite the query for more effective vector search or to directly target specific parts of the KG.  
* **Multi-Hop Reasoning:** A significant advantage of KGs is their ability to facilitate multi-hop reasoning. Questions like "How does the work permit process relate to the residence permit process, and which agencies are involved in the initial registration steps for a new resident who has both?" are very difficult for vector RAG alone. The KG can trace these connections explicitly: WorkPermit RELATED\_TO ResidencePermit; ResidencePermit INVOLVES\_STEP InitialRegistration; InitialRegistration HANDLED\_BY\_AGENCY DVV. This retrieved path or subgraph provides rich, structured context that vector search cannot easily replicate.9 The RAG system should be designed to identify such relational queries and leverage the KG's traversal capabilities.  
* **Linking Vector Chunks to KG Entities:** During the KG construction or document indexing phase, entities identified in text chunks can be linked to their corresponding nodes in the KG. The vector embeddings of these chunks can then store metadata pointing to these KG entities. This allows for a tighter integration where retrieved chunks immediately provide entry points into the KG.  
* **Tools and Frameworks:** LangChain and LlamaIndex offer components specifically designed for GraphRAG, including retrievers that can combine vector search with KG lookups (e.g., Neo4j's HybridCypherRetriever which combines vector, full-text, and Cypher graph traversal).25

By implementing these integration patterns, Finntegrate can move beyond simple semantic similarity to a system that understands and utilizes the explicit relationships within the Finnish immigration domain, leading to more accurate, comprehensive, and contextually aware responses.

The following table provides a comparative evaluation of open-source knowledge graph database options relevant to Finntegrate:

**Table 1: Evaluation of Open-Source Knowledge Graph Databases**

| Feature                       | Neo4j                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | RDFLib \+ Triple Store (e.g., Fuseki, GraphDB Free)                          | FalkorDB                                                                                                       |
| :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| **Data Model**                | Property Graph                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | RDF (Triples)                                                                | Property Graph (RedisGraph fork)                                                                               |
| **Query Language**            | Cypher                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | SPARQL                                                                       | Subset of Cypher                                                                                               |
| **Finnish/Multilingual**      | Via multiple properties (e.g., name\_fi, name\_en) 8                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Native language-tagged literals (e.g., "nimi"@fi) 22                         | Via multiple properties, similar to Neo4j                                                                      |
| **Python Integration**        | Excellent (Official driver, Py2neo, OGM libraries)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Excellent (RDFLib library)                                                   | Good (redis-py, specific client libraries)                                                                     |
| **Scalability**               | Good, enterprise version for clustering. Community for single instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Varies by triple store; some support clustering. RDFLib itself is in-memory. | Built on Redis, can leverage Redis clustering for scalability.                                                 |
| **Ease of Setup/Maintenance** | Relatively straightforward for community edition. Docker available.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | RDFLib is a library. Triple store setup varies; Fuseki is relatively easy.   | Requires Redis. Can be straightforward, especially with Docker.                                                |
| **Open-Source License**       | GPLv3 (Community Edition), AGPLv3 for some components.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | BSD (RDFLib), Apache 2.0 (Fuseki), MPL 2.0 (GraphDB Free)                    | Redis Source Available License (RSALv2) / Server Side Public License (SSPL)                                    |
| **Strengths for Finntegrate** | Mature, large community, good tooling, native graph traversals, growing GenAI/RAG support.2 Schema flexibility.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Adherence to W3C standards, formal semantics, good for data integration.     | High performance for certain graph operations due to sparse matrix representation.7                            |
| **Potential Challenges**      | GPL license might be a concern for some derivative works. Clustering is enterprise.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | SPARQL learning curve. Performance depends heavily on chosen triple store.   | Newer, smaller community. Cypher implementation might not be as complete as Neo4j's. License change from AGPL. |
| **Recommendation Rationale**  | **Neo4j (Community Edition)** is recommended as the primary option due to its balance of maturity, strong Python support, flexible property graph model suitable for iterative development, and rapidly expanding ecosystem for GraphRAG applications. Its Cypher query language is often considered intuitive for developers familiar with SQL. The availability of tools like the Neo4j Data Importer and its visual browser aids development and exploration. For a small team, the extensive documentation and community support are valuable. While RDFLib with a triple store offers strong semantic capabilities, the operational overhead of managing a separate triple store and the potentially steeper learning curve for SPARQL might be less ideal given Finntegrate's constraints. FalkorDB, while performant, has a less established ecosystem and its licensing might be a consideration. |                                                                              |                                                                                                                |

### **II. Finnish Language Processing Considerations**

Processing Finnish text for knowledge graph construction presents unique challenges due to its rich morphology, including extensive use of compound words and numerous noun cases. Addressing these effectively is paramount for the accuracy of entity and relationship extraction.

#### **A. Evaluation of NLP Tools with Strong Finnish Language Support**

Several open-source toolkits and models offer robust support for Finnish, developed primarily by research groups at the University of Turku (TurkuNLP) and the University of Helsinki (Helsinki-NLP).

* **TurkuNLP Ecosystem:**  
  * **Turku Neural Parser Pipeline:** This is a comprehensive, state-of-the-art pipeline for Finnish, performing segmentation, tokenization, morphological tagging, lemmatization, and dependency parsing.3 It's built on neural models (often BERT-based) and produces output in the CoNLL-U format, which is rich in linguistic annotations. It has demonstrated top performance in shared tasks, especially for lemmatization and parsing.4 Its open-source nature (Apache 2.0 license) and ability to be run via command line or server mode make it a strong candidate.4  
  * **FinBERT & FinGPT:** TurkuNLP has developed powerful pre-trained language models for Finnish, FinBERT (BERT-based) and FinGPT (GPT-based).15 These models can be fine-tuned for various downstream tasks, including Named Entity Recognition (NER) and Relationship Extraction (RE). They represent the cutting edge in Finnish language understanding and generation.  
  * **Finnish NER Tools:** TurkuNLP provides specific NER models and annotated corpora for Finnish.15 These systems often leverage FinBERT and are trained on diverse Finnish texts.  
* **Helsinki-NLP Ecosystem:**  
  * **HFST (Helsinki Finite-State Technology):** This is a powerful framework for creating morphological analyzers and other finite-state tools.49 HFST is particularly well-suited for handling the complex morphology of Finnish, including compound word decomposition and the analysis/generation of inflected forms. Python bindings are available, allowing integration into broader NLP pipelines.  
  * **Opus-MT:** A suite of open-source neural machine translation models covering a vast number of language pairs, including Finnish, English, and Swedish.38 These are invaluable for Finntegrate's multilingual requirements.  
* **Omorfi:** A dedicated, open-source morphological analyzer for Finnish known for its high accuracy and detailed analyses.13 It handles complex Finnish morphology, including compound splitting and case normalization, providing multiple possible analyses if ambiguity exists. Omorfi can be used as a command-line tool or a library and offers Python integration points.  
* **spaCy:** While not inherently Finnish-specific, spaCy is a widely-used, efficient NLP library in Python.20 It supports custom models and can be integrated with Finnish word vectors or pre-trained components if available. Its pipeline architecture is convenient for building custom processing workflows.

A layered approach to Finnish NLP may be most effective for Finntegrate. The Turku Neural Parser Pipeline can provide a robust baseline for tokenization, lemmatization, POS tagging, and dependency parsing. For highly detailed morphological information, particularly for compound word analysis or resolving complex case forms critical for rule-based RE, Omorfi or HFST-based components could be integrated to enrich the output from the Turku parser. FinBERT or FinGPT models can then be applied for higher-level semantic tasks like NER and RE on this thoroughly preprocessed text. This leverages the strengths of each toolset.

#### **B. Techniques for Addressing Finnish Linguistic Challenges (Compound Words, Numerous Noun Cases)**

Finnish is an agglutinative language with a rich morphology, posing specific challenges for NLP.

* **Compound Words (Yhdyssanat):**  
  * **Challenge:** Finnish frequently forms long compound words (e.g., *oleskelulupahakemus* for "residence permit application"). Treating these as single tokens obscures their internal structure and meaning, hindering NER (e.g., is "lupa" (permit) an entity within the compound?) and search.  
  * **Techniques:**  
    * **Specialized Morphological Analyzers:** Tools like **Omorfi** 13, **HFST**\-based analyzers 49, and **FinnPos** 13 are designed to decompose Finnish compounds into their constituent morphemes or words (e.g., *oleskelu* \+ *lupa* \+ *hakemus*). The Turku Neural Parser Pipeline also performs morphological analysis that includes handling compounds.4  
    * **Mechanism:** These tools typically use extensive lexical resources and morphological rules specific to Finnish to identify valid split points within words.  
    * **Impact:** Accurate compound splitting is vital. It allows individual components to be recognized as potential entities or keywords, improves lemmatization accuracy, and provides a more granular basis for relationship extraction and semantic understanding. For instance, recognizing "työ" (work) within "työperusteinen oleskelulupa" (work-based residence permit) is key to linking it to employment concepts.  
* **Numerous Noun Cases (Sijamuodot):**  
  * **Challenge:** Finnish has 15 grammatical noun cases (e.g., genitive, partitive, inessive, elative), each marking different grammatical functions and often realized through suffixes. A single noun lemma can have a multitude of inflected forms.  
  * **Techniques:**  
    * **Morphological Tagging & Lemmatization:** The aforementioned tools (Turku Neural Parser Pipeline 4, Omorfi 14, HFST 49, FinnPos 13) perform morphological tagging, which identifies the specific case (and other grammatical features like number) of each noun. Crucially, they also provide **lemmatization**, reducing all inflected forms to a common base or dictionary form (nominative singular for nouns). For example, *luvalla* (with a permit \- adessive case), *luvan* (permit's \- genitive case), and *lupaa* (permit \- partitive case) would all be lemmatized to *lupa* (permit).  
    * **Impact:** Lemmatization is essential for normalizing text for KG construction. It ensures that different surface forms of the same underlying concept are mapped to the same entity or property in the KG. This is critical for effective information retrieval and data aggregation. Recognizing the grammatical case itself is also important for rule-based RE, as cases often signal semantic roles (e.g., the inessive case *missä* often indicates location).  
* **Other Morphological Features:**  
  * **Agglutination:** Finnish extensively uses suffixes to denote grammatical information, leading to long words. Morphological analyzers segment these suffixes.  
  * **Vowel Harmony:** This phonological rule affects suffix forms.52 Morphological tools for Finnish inherently handle these rules.

The quality of relationship extraction and the effectiveness of user query processing against the KG heavily depend on the accuracy of this initial morphological analysis and lemmatization. If a user queries for *työlupa* and the documents contain various inflected forms, robust lemmatization ensures a match. Similarly, understanding the grammatical roles signaled by cases is fundamental for syntactic parsing, which in turn aids rule-based relationship extraction.

#### **C. Recommended Finnish-Specific Named Entity Recognition (NER) Models**

For identifying entities like Agency, Process, and Document in Finnish bureaucratic text, several approaches are viable:

* **Fine-tuned FinBERT Models:**  
  * The **Kansallisarkisto/finbert-ner** model, available on Hugging Face, is a strong starting point.5 It was fine-tuned from bert-base-finnish-cased-v1 (a TurkuNLP model) on a corpus including the Turku OntoNotes Entities Corpus, NewsEye data, and Finnish archival documents. It recognizes standard entity types like PER, ORG, LOC, DATE, etc..5  
  * **Domain Adaptation:** General-purpose Finnish NER models, including Kansallisarkisto/finbert-ner, will likely require **significant fine-tuning** on Finntegrate's specific corpus of bureaucratic Markdown documents. This is because bureaucratic language contains specialized terminology and nuances in how entities are expressed (e.g., specific permit names like *erityisoleskelulupa*) that may not be well-represented in general training data. The process described in for adapting FinBERT to archival documents, including the creation of custom entities (FIBC, JON), serves as a good methodological example. Finntegrate will need to define its own set of target entities (as listed in the user query) and create an annotated dataset for this fine-tuning.  
  * Other FinBERT models from TurkuNLP can also serve as a base for fine-tuning.15  
* **TurkuNLP NER Tools:** The TurkuNLP group offers state-of-the-art NER systems for Finnish, often based on their FinBERT models.15 These systems are trained to recognize a broad set of entity types.  
* **LLMs (e.g., FinGPT):** For rapid prototyping, bootstrapping an annotation process, or identifying entities not well-covered by existing supervised models, LLMs like FinGPT can be prompted for NER.16 The example in 18, where an LLM extracts names and IDs (which are entities) from Finnish interviews, demonstrates this capability. However, for production use, fine-tuned models generally offer better consistency and control for specific entity types.

The key to successful NER for Finntegrate will be domain adaptation. Allocating resources to create a high-quality, domain-specific annotated dataset from the project's Markdown files will be crucial for achieving the desired accuracy in identifying immigration-related entities.

#### **D. Effective Approaches for Relationship Extraction in Finnish Text**

Once entities are identified, the next step is to extract the semantic relationships between them. Given the nature of Finnish and the bureaucratic text, a combination of approaches is recommended:

* **Rule-Based Relationship Extraction (Leveraging Dependency Parses):**  
  * Finnish has a relatively free word order, which can make surface-pattern-based rules brittle. However, **dependency parsing**, which reveals the grammatical relationships between words regardless of their linear order, provides a more stable foundation.55  
  * The Turku Neural Parser Pipeline provides rich dependency parse output (in CoNLL-U format). Rules can be defined based on specific dependency paths connecting two named entities via a verb or prepositional structure. For example, a pattern like Entity\_Agency (nsubj) ← myöntää (verb) → Entity\_Permit (obj) could reliably extract an ISSUES(Agency, Permit) relationship.  
  * This approach is well-suited for common, clearly defined relationships prevalent in formal bureaucratic language.6  
* **Supervised Machine Learning:**  
  * This involves training a classifier (e.g., SVM, Neural Network, or fine-tuning a transformer model like FinBERT/FinGPT) on Finnish sentences that have been manually annotated with entity pairs and their corresponding relationship types.6  
  * While potentially very powerful, this method requires a significant investment in creating annotated training data, which may be a constraint for Finntegrate.  
  * If annotated data can be produced, toolkits like OpenNRE 19 could be adapted for Finnish.  
* **LLM-Based Relationship Extraction (e.g., using FinGPT):**  
  * LLMs can be prompted to identify and classify relationships between given entities in a text snippet. For example, given the text "Migri käsittelee hakemuksen" and entities "Migri" and "hakemuksen," an LLM could be asked to determine the relationship (e.g., PROCESSES).18  
  * Few-shot prompting (providing a few examples in the prompt) can significantly improve performance.  
  * This approach is flexible and can capture more nuanced or context-dependent relationships that might be difficult to define with explicit rules.  
* **Open Information Extraction (OpenIE):**  
  * OpenIE systems aim to extract relational triples (Entity1, RelationPhrase, Entity2) from text without requiring predefined relation types.6 While powerful for discovery, the extracted relation phrases would need to be mapped to Finntegrate's ontology.  
* **Hybrid Approaches:**  
  * A practical strategy for Finntegrate would be to combine rule-based methods for high-precision extraction of frequent and unambiguous relationships (e.g., "Agency X is responsible for Process Y" if explicitly stated) with LLM-based methods for broader coverage and handling more complex sentence structures. The LLM could also be used to generate candidate relationships that are then validated or refined.

The choice of RE strategy should consider the trade-offs between development effort (especially for data annotation), precision requirements, and the types of relationships to be extracted. The syntactic structure of Finnish, as revealed by dependency parsing, should be a key input for any RE method.

The following table provides a comparative analysis of the recommended open-source Finnish NLP tools for Finntegrate:

**Table 2: Comparative Analysis of Open-Source Finnish NLP Tools**

| Tool/Library                                        | Core Capabilities                                                                                                             | Finnish Language Performance/Suitability                                                                   | Open-Source License                  | Key Dependencies (Illustrative)  | Maintainability (Small Team)       | Python Interoperability         |
| :-------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- | :----------------------------------- | :------------------------------- | :--------------------------------- | :------------------------------ |
| **Turku Neural Parser Pipeline** 4                  | Tokenization, Lemmatization, POS Tagging, Full Morphological Analysis (compounds, cases), Dependency Parsing. CoNLL-U output. | State-of-the-art for Finnish. Excellent for core linguistic preprocessing. 4                               | Apache 2.0                           | Python, PyTorch, various DL libs | Moderate (pre-trained models)      | CLI, Server API, Python wrapper |
| **Omorfi** 13                                       | Deep Morphological Analysis (compound splitting, inflection generation/analysis, case identification), Lemmatization.         | Highly accurate for Finnish morphology. Specialized tool. 13                                               | GPL-3.0, Apache-2.0 (parts)          | HFST, Python                     | Moderate                           | Python bindings, CLI            |
| **HFST (Helsinki Finite-State Technology)** 49      | Morphological analysis, spell-checking, tokenization (via FSTs). Excellent for rule-based morphology.                         | Very strong for Finnish and other morphologically rich languages. 49                                       | Apache 2.0 (core)                    | C++, Python bindings             | Moderate (requires FST design)     | Python bindings, CLI            |
| **FinBERT (TurkuNLP/Kansallisarkisto)** 5           | Pre-trained Transformer model for Finnish. Base for fine-tuning on tasks like NER, RE, Classification.                        | State-of-the-art base model for Finnish. Kansallisarkisto/finbert-ner is a good NER starting point. 1      | Apache 2.0                           | Python, PyTorch, Transformers    | High (fine-tuning requires data)   | Hugging Face Transformers       |
| **FinGPT (TurkuNLP)** 16                            | Generative Pre-trained Transformer for Finnish. Capable of few-shot/zero-shot NER, RE, text generation, Q\&A.                 | State-of-the-art generative model for Finnish. 16                                                          | Openly Available (likely permissive) | Python, PyTorch, Transformers    | High (prompt engineering, API use) | Hugging Face, Custom APIs       |
| **spaCy \+ Finnish Model (if available/custom)** 20 | General NLP pipeline (tokenization, POS, NER, dependencies). Relies on language-specific models.                              | Performance depends heavily on the quality of the Finnish model used. Good framework for custom pipelines. | MIT                                  | Python, various model data       | Moderate to High (model dev)       | Excellent Python library        |
| **Helsinki-NLP Opus-MT** 39                         | Neural Machine Translation between many languages, including Finnish, English, Swedish.                                       | High-quality open-source translation models. 39                                                            | Various (models often CC-BY)         | Python, MarianNMT, Transformers  | Moderate (using pre-trained)       | Hugging Face Transformers, APIs |

This comparison highlights that a combination, primarily leveraging the Turku Neural Parser Pipeline for foundational processing and FinBERT (specifically Kansallisarkisto/finbert-ner or a custom fine-tune) for NER, offers a robust, open-source, and Python-friendly path for Finntegrate. Omorfi or HFST can be valuable for deeper morphological dives if needed, and FinGPT/Opus-MT address generative and translation tasks.

### **III. Practical Implementation Examples (with Code Snippets)**

This section provides conceptual Python code snippets to illustrate key stages of the knowledge graph construction pipeline, focusing on the use of recommended tools for Finnish bureaucratic text. These examples aim to be illustrative rather than exhaustive, production-ready code.

#### **A. Entity Extraction from Finnish Bureaucratic Text**

**1\. Using Fine-tuned FinBERT (e.g., Kansallisarkisto/finbert-ner via Hugging Face pipeline)**

This approach uses a pre-trained (and potentially further fine-tuned by Finntegrate) FinBERT model for NER.

Python

from transformers import pipeline

\# Load the NER pipeline with the Finnish model  
\# For Finntegrate, this might be a custom fine-tuned model based on Kansallisarkisto/finbert-ner  
ner\_pipeline \= pipeline("token-classification",   
                        model="Kansallisarkisto/finbert-ner",   
                        aggregation\_strategy="simple") \# 'simple' groups sub-tokens

finnish\_text \= "Maahanmuuttovirasto myöntää ensimmäisen oleskeluluvan Suomessa."  
\# (Translation: The Finnish Immigration Service grants the first residence permit in Finland.)

entities \= ner\_pipeline(finnish\_text)  
print("Extracted Entities (FinBERT):")  
for entity in entities:  
    print(f"- Entity: '{entity\['word'\]}', Type: {entity\['entity\_group'\]}, Score: {entity\['score'\]:.4f}")

\# Example of expected output (entity types depend on model's training):  
\# \- Entity: 'Maahanmuuttovirasto', Type: ORG, Score: 0.9987  
\# \- Entity: 'oleskeluluvan', Type: PRODUCT (or a custom PERMIT\_TYPE), Score: 0.9912  
\# \- Entity: 'Suomessa', Type: LOC, Score: 0.9995

Reference for basic pipeline usage: 5  
This snippet demonstrates loading a Finnish NER model and applying it to a sentence. The aggregation\_strategy="simple" helps in merging word pieces that belong to the same entity. For Finntegrate, the entity\_group would ideally map to the custom entities defined in the project's ontology (e.g., AGENCY, PERMIT\_TYPE, LOCATION).  
**2\. Using LLM (e.g., FinGPT or other open model) with Prompting**

LLMs can perform NER, especially with few-shot prompting or for custom entity types.

Python

\# This is a conceptual example assuming an LLM API endpoint  
\# Actual API calls will vary based on the chosen LLM and hosting  
import requests  
import json

\# Assume an API endpoint for a Finnish-capable LLM  
LLM\_API\_URL \= "YOUR\_FINNISH\_LLM\_API\_ENDPOINT"  
API\_KEY \= "YOUR\_API\_KEY"

def extract\_entities\_llm(text, entity\_types):  
    prompt \= f"""  
    Extract the specified entities from the following Finnish text.  
    Return the output as a JSON list of objects, where each object has "text" and "type".  
    Entity Types: {', '.join(entity\_types)}

    Text: "{text}"

    Extracted Entities (JSON):  
    """  
      
    payload \= {  
        "prompt": prompt,  
        "max\_tokens": 200, \# Adjust as needed  
        "temperature": 0.1 \# For more deterministic output  
    }  
    headers \= {  
        "Authorization": f"Bearer {API\_KEY}",  
        "Content-Type": "application/json"  
    }  
      
    \# response \= requests.post(LLM\_API\_URL, json=payload, headers=headers)  
    \# response.raise\_for\_status()  
    \# extracted\_data \= response.json()  
      
    \# Mocked response for demonstration  
    if "Maahanmuuttovirasto" in text and "oleskeluluvan" in text:  
        mock\_response\_json \= """  
         
        """  
        extracted\_data \= json.loads(mock\_response\_json)  
    else:  
        extracted\_data \=  
          
    return extracted\_data

finnish\_text\_llm \= "Maahanmuuttovirasto myöntää ensimmäisen oleskeluluvan Suomessa."  
defined\_entity\_types \=

llm\_entities \= extract\_entities\_llm(finnish\_text\_llm, defined\_entity\_types)  
print("\\nExtracted Entities (LLM):")  
for entity in llm\_entities:  
    print(f"- Entity: '{entity\['text'\]}', Type: {entity\['type'\]}")

Reference for LLM data extraction from Finnish: 18  
This conceptual example shows how to construct a prompt for an LLM to extract predefined entity types. The LLM is instructed to return a structured JSON output, which simplifies parsing. For Finntegrate, using FinGPT 16 or a similar powerful open model fine-tuned for Finnish would be ideal.

#### **B. Relationship Extraction Techniques for Finnish**

**1\. Rule-based RE using Turku Neural Parser Dependency Parses**

This method uses the syntactic structure provided by a dependency parser.

Python

\# Conceptual: Assumes CoNLL-U output from Turku Neural Parser is parsed into a suitable data structure  
\# For a real implementation, libraries like 'conllu' can parse CoNLL-U files.

\# Example CoNLL-U snippet for "Maahanmuuttovirasto myöntää oleskeluluvan."  
\# 1 Maahanmuuttovirasto Maahanmuuttovirasto NOUN... nsubj... ORG\_ENTITY  
\# 2 myöntää            myöntää            VERB... root ... \_  
\# 3 oleskeluluvan      oleskelulupa       NOUN... obj  ... PERMIT\_ENTITY  
\# (Simplified, actual CoNLL-U has more fields; ORG\_ENTITY/PERMIT\_ENTITY are hypothetical NER tags)

class Token:  
    def \_\_init\_\_(self, id, form, lemma, upos, head, deprel, ner\_tag=None):  
        self.id \= int(id)  
        self.form \= form  
        self.lemma \= lemma  
        self.upos \= upos  
        self.head \= int(head)  
        self.deprel \= deprel  
        self.ner\_tag \= ner\_tag \# Populated from NER step

\# Assume 'sentence\_tokens' is a list of Token objects from parsed CoNLL-U  
\# and NER has been run to populate token.ner\_tag

def extract\_relationships\_rule\_based(sentence\_tokens):  
    relations \=  
    for token in sentence\_tokens:  
        if token.upos \== 'VERB' and token.lemma \== 'myöntää': \# "myöntää" (grants)  
            subject \= None  
            obj \= None  
            for t in sentence\_tokens:  
                if t.head \== token.id and t.deprel \== 'nsubj' and t.ner\_tag \== 'AGENCY':  
                    subject \= t  
                if t.head \== token.id and t.deprel \== 'obj' and t.ner\_tag \== 'PERMIT\_TYPE':  
                    obj \= t  
              
            if subject and obj:  
                relations.append({  
                    "subject": subject.form,   
                    "subject\_type": subject.ner\_tag,  
                    "relation": "MYÖNTÄÄ\_PERMITIN", \# GRANTS\_PERMIT  
                    "object": obj.form,  
                    "object\_type": obj.ner\_tag  
                })  
    return relations

\# Mock sentence\_tokens for "Maahanmuuttovirasto myöntää oleskeluluvan."  
mock\_sentence\_tokens \=

rule\_based\_relations \= extract\_relationships\_rule\_based(mock\_sentence\_tokens)  
print("\\nExtracted Relationships (Rule-based):")  
for rel in rule\_based\_relations:  
    print(f"- {rel\['subject'\]} ({rel\['subject\_type'\]}) "  
          f"--\[{rel\['relation'\]}\]--\> "  
          f"{rel\['object'\]} ({rel\['object\_type'\]})")

Reference for dependency parsing for RE: 6  
This example outlines how dependency relations (nsubj for subject, obj for object) and NER tags can be combined with a specific verb lemma (myöntää) to extract a typed relationship. The Turku Neural Parser Pipeline 4 provides the necessary dependency information.  
**2\. LLM-based RE with FinGPT/Open Models**

Prompt an LLM to classify the relationship between two pre-identified entities.

Python

\# Conceptual LLM API call  
def extract\_relationship\_llm(text, entity1\_text, entity1\_type, entity2\_text, entity2\_type, relation\_types):  
    prompt \= f"""  
    Given the Finnish text and two entities, identify the relationship between Entity1 and Entity2  
    from the predefined list of relation types. If no relationship from the list applies, output "NO\_RELATION".

    Text: "{text}"  
    Entity1: "{entity1\_text}" (Type: {entity1\_type})  
    Entity2: "{entity2\_text}" (Type: {entity2\_type})  
    Predefined Relation Types: {', '.join(relation\_types)}

    Relationship:   
    """  
    \#... (LLM API call similar to NER example)...  
      
    \# Mocked response for demonstration  
    if entity1\_text \== "Maahanmuuttovirasto" and entity2\_text \== "oleskeluluvan" and "myöntää" in text:  
        mock\_llm\_relation\_output \= "MYÖNTÄÄ\_PERMITIN" \# GRANTS\_PERMIT  
    else:  
        mock\_llm\_relation\_output \= "NO\_RELATION"  
          
    return mock\_llm\_relation\_output

finnish\_text\_re\_llm \= "Maahanmuuttovirasto myöntää ensimmäisen oleskeluluvan."  
entity1 \= {"text": "Maahanmuuttovirasto", "type": "AGENCY"}  
entity2 \= {"text": "oleskeluluvan", "type": "PERMIT\_TYPE"} \# Assuming lemma form after NER  
defined\_relation\_types \=

llm\_relation \= extract\_relationship\_llm(finnish\_text\_re\_llm,   
                                        entity1\["text"\], entity1\["type"\],  
                                        entity2\["text"\], entity2\["type"\],  
                                        defined\_relation\_types)

print(f"\\nExtracted Relationship (LLM): {entity1\['text'\]} \--\[{llm\_relation}\]--\> {entity2\['text'\]}")

Reference for LLM-based RE: 21  
This conceptual snippet shows prompting an LLM to classify a relationship between two entities found in a sentence, given a list of possible relation types from Finntegrate's ontology.

#### **C. Knowledge Graph Construction using Recommended Tools**

**1\. Using RDFLib**

This demonstrates creating RDF triples and serializing them.

Python

from rdflib import Graph, Literal, RDF, URIRef, Namespace

\# Define namespaces  
FINN \= Namespace("http://finntegrate.fi/ontology\#")  
DCTERMS \= Namespace("http://purl.org/dc/terms/")  
FOAF \= Namespace("http://xmlns.com/foaf/0.1/") \# Example, may not be directly used

\# Create a graph  
g \= Graph()  
g.bind("finn", FINN)  
g.bind("dcterms", DCTERMS)

\# Assume entities and relations extracted from previous steps  
\# Example: (Maahanmuuttovirasto, MYÖNTÄÄ\_PERMITIN, oleskelulupa)  
agency\_uri \= URIRef("http://finntegrate.fi/agency/migri")  
permit\_uri \= URIRef("http://finntegrate.fi/process/oleskelulupa\_ensimmainen")

\# Add agency node  
g.add((agency\_uri, RDF.type, FINN.Agency))  
g.add((agency\_uri, FINN.name, Literal("Maahanmuuttovirasto", lang="fi")))  
g.add((agency\_uri, FINN.name, Literal("Finnish Immigration Service", lang="en")))  
g.add((agency\_uri, FINN.abbreviation, Literal("Migri")))

\# Add permit process node  
g.add((permit\_uri, RDF.type, FINN.Process))  
g.add((permit\_uri, FINN.name, Literal("Ensimmäinen oleskelulupa", lang="fi")))  
g.add((permit\_uri, FINN.name, Literal("First residence permit", lang="en")))

\# Add relationship  
g.add((agency\_uri, FINN.myontaaPermitin, permit\_uri)) \# 'myontaaPermitin' is 'issuesPermit'

\# Add provenance (conceptual)  
source\_doc\_uri \= URIRef("http://finntegrate.fi/source/migri\_website\_page\_X")  
g.add((agency\_uri, DCTERMS.source, source\_doc\_uri))  
g.add((permit\_uri, DCTERMS.source, source\_doc\_uri))  
g.add(( (agency\_uri, FINN.myontaaPermitin, permit\_uri) , DCTERMS.source, source\_doc\_uri)) \# Reification for relation source

print("\\nRDF Graph (Turtle):")  
print(g.serialize(format\="turtle"))

References: 12  
This example shows how to define namespaces, create URIs for entities, add typed literals (with language tags for multilingual support), and assert triples representing nodes and relationships. 12 offers a more comprehensive example of a KG construction pipeline using RDFLib.  
**2\. Using Neo4j with Python (Official neo4j driver)**

This demonstrates creating nodes and relationships in Neo4j.

Python

from neo4j import GraphDatabase

\# Neo4j connection details (replace with actual credentials)  
URI \= "bolt://localhost:7687"  
AUTH \= ("neo4j", "password")

class Neo4jKGBuilder:  
    def \_\_init\_\_(self, uri, user, password):  
        self.driver \= GraphDatabase.driver(uri, auth=(user, password))

    def close(self):  
        self.driver.close()

    def create\_node(self, tx, label, properties):  
        query \= f"CREATE (n:{label} $props) RETURN id(n)"  
        result \= tx.run(query, props=properties)  
        return result.single()

    def create\_relationship(self, tx, start\_node\_id, end\_node\_id, rel\_type, properties=None):  
        if properties:  
            query \= (f"MATCH (a), (b) WHERE id(a) \= $start\_id AND id(b) \= $end\_id "  
                     f"CREATE (a)-\[r:{rel\_type} $props\]-\>(b) RETURN type(r)")  
            tx.run(query, start\_id=start\_node\_id, end\_id=end\_node\_id, props=properties)  
        else:  
            query \= (f"MATCH (a), (b) WHERE id(a) \= $start\_id AND id(b) \= $end\_id "  
                     f"CREATE (a)-\[r:{rel\_type}\]-\>(b) RETURN type(r)")  
            tx.run(query, start\_id=start\_node\_id, end\_id=end\_node\_id)

\# Example usage  
\# builder \= Neo4jKGBuilder(URI, AUTH, AUTH)  
\# with builder.driver.session(database="neo4j") as session: \# Use "neo4j" or your specific database  
\#     \# Create Agency node  
\#     migri\_id \= session.execute\_write(  
\#         builder.create\_node, "Agency",   
\#         {"name\_fi": "Maahanmuuttovirasto", "name\_en": "Finnish Immigration Service", "abbreviation": "Migri"}  
\#     )  
\#     \# Create Permit Process node  
\#     permit\_id \= session.execute\_write(  
\#         builder.create\_node, "Process",  
\#         {"name\_fi": "Ensimmäinen oleskelulupa", "name\_en": "First residence permit"}  
\#     )  
\#     \# Create relationship  
\#     session.execute\_write(  
\#         builder.create\_relationship, migri\_id, permit\_id, "ISSUES\_PERMIT"  
\#     )  
\# builder.close()  
print("\\nNeo4j KG construction conceptualized (see commented Python code).")  
print("Example Cypher for creation:")  
print("CREATE (migri:Agency {name\_fi: 'Maahanmuuttovirasto', name\_en: 'Finnish Immigration Service', abbreviation: 'Migri'})")  
print("CREATE (permit:Process {name\_fi: 'Ensimmäinen oleskelulupa', name\_en: 'First residence permit'})")  
print("MATCH (a:Agency {abbreviation: 'Migri'}), (p:Process {name\_fi: 'Ensimmäinen oleskelulupa'}) CREATE (a)--\>(p)")

References for general Neo4j steps: 8  
This snippet shows how to use the official Neo4j Python driver to create nodes with labels and properties, and relationships between them. Multilingual properties are handled as separate fields (e.g., name\_fi, name\_en).

#### **D. Effective Query Patterns for Information Retrieval**

**1\. SPARQL (for RDFLib/Triple Stores)**

Querying an RDF graph for typical Finntegrate user needs.

Code snippet

\# Query 1: What documents are needed for a "First residence permit" (Ensimmäinen oleskelulupa)?  
\# (Assuming 'Ensimmäinen oleskelulupa' is identified by its Finnish name or a URI)  
PREFIX finn: \<http://finntegrate.fi/ontology\#\>  
PREFIX rdfs: \<http://www.w3.org/2000/01/rdf-schema\#\>

SELECT?doc\_name\_en?doc\_name\_fi  
WHERE {  
 ?permit\_process finn:name "Ensimmäinen oleskelulupa"@fi ;  
                  finn:requiresDocument?document.  
  OPTIONAL {?document finn:name?doc\_name\_en. FILTER(lang(?doc\_name\_en) \= "en") }  
  OPTIONAL {?document finn:name?doc\_name\_fi. FILTER(lang(?doc\_name\_fi) \= "fi") }  
}

\# Query 2: Which agencies are involved in the "Family Reunification Process"?  
\# (Assuming 'Perheenyhdistäminen' URI)  
SELECT?agency\_name\_fi?agency\_abbreviation  
WHERE {  
  finn:Perheenyhdistamisprosessi finn:processedByAgency?agency.  
 ?agency finn:name?agency\_name\_fi. FILTER(lang(?agency\_name\_fi) \= "fi")  
  OPTIONAL {?agency finn:abbreviation?agency\_abbreviation. }  
}

References: 22  
These SPARQL queries demonstrate how to retrieve information based on relationships defined in the ontology (e.g., finn:requiresDocument, finn:processedByAgency) and how to fetch multilingual labels using language tags.  
**2\. Cypher (for Neo4j)**

Equivalent queries for a Neo4j property graph.

Cypher

// Query 1: What documents are needed for a "First residence permit"?  
MATCH (proc:Process {name\_fi: "Ensimmäinen oleskelulupa"})--\>(doc:Document)  
RETURN doc.name\_en AS document\_english\_name, doc.name\_fi AS document\_finnish\_name;

// Query 2: Which agencies are involved in the "Family Reunification Process"?  
MATCH (proc:Process {name\_fi: "Perheenyhdistämisprosessi"})\<--(agency:Agency)  
RETURN agency.name\_fi AS agency\_finnish\_name, agency.abbreviation;

// Query 3: Show the steps for "Work-based residence permit" and the documents for each step.  
MATCH path \= (proc:Process {name\_fi: "Työperusteinen oleskelulupa"})--\>(step:Step)  
OPTIONAL MATCH (step)--\>(doc:Document)  
RETURN proc.name\_fi AS process\_name, step.name\_fi AS step\_name, collect(doc.name\_fi) AS required\_documents\_for\_step  
ORDER BY length(path); // To get steps in order, assuming CONSISTS\_OF\_STEP implies sequence

References: 61  
These Cypher queries illustrate node and relationship pattern matching, property retrieval, and path traversal to answer complex questions involving multiple entities and relationships.

#### **E. Integrating Knowledge Graph Queries with LLM-based Response Generation**

**1\. KG as Context for LLM (Conceptual)**

Retrieve facts from the KG and provide them as structured context to an LLM.

Python

\# Conceptual \- combining KG query results with LLM prompting  
def generate\_response\_with\_kg\_context(user\_query, kg\_query\_function, llm\_generation\_function):  
    \# 1\. Understand user query (e.g., extract key entities)  
    \# (Simplified: assume 'permit\_name' is extracted from user\_query)  
    permit\_name\_fi\_from\_query \= "Ensimmäinen oleskelulupa" 

    \# 2\. Query the KG (example using a conceptual Cypher query result)  
    \# cypher\_query \= f"MATCH (p:Process {{name\_fi: '{permit\_name\_fi\_from\_query}'}})--\>(d:Document) RETURN d.name\_fi, d.name\_en"  
    \# kg\_results \= execute\_cypher\_query(cypher\_query)   
    \# Example: kg\_results \=  
      
    \# Mocked KG results for demonstration  
    if permit\_name\_fi\_from\_query \== "Ensimmäinen oleskelulupa":  
        kg\_results \= \[  
            {"name\_fi": "Passi", "name\_en": "Passport"},  
            {"name\_fi": "Valokuva", "name\_en": "Photograph"}  
        \]  
    else:  
        kg\_results \=

    \# 3\. Format KG results as context for LLM  
    context\_str \= f"Information for '{permit\_name\_fi\_from\_query}':\\nRequired documents:\\n"  
    for res in kg\_results:  
        context\_str \+= f"- {res.get('name\_fi', 'N/A')} (English: {res.get('name\_en', 'N/A')})\\n"  
      
    \# 4\. Generate response using LLM with the KG context  
    final\_prompt \= f"""  
    User query: "{user\_query}"  
      
    Context from Knowledge Graph:  
    {context\_str}  
      
    Based on the provided context, answer the user's query in a helpful and clear manner.  
    If the context doesn't fully answer, say so.  
    Answer:  
    """  
      
    \# llm\_response \= llm\_generation\_function(final\_prompt)  
    \# Mocked LLM response  
    llm\_response \= (f"For the {permit\_name\_fi\_from\_query}, you generally need the following documents: "  
                    f"Passport (Passi), and Photograph (Valokuva). "  
                    f"Please check the official Migri website for the most current and complete list.")  
      
    return llm\_response

user\_query\_example \= "What documents do I need for a first residence permit in Finland?"  
\# Assume kg\_query\_function executes Cypher/SPARQL and llm\_generation\_function calls an LLM  
\# response \= generate\_response\_with\_kg\_context(user\_query\_example, execute\_cypher\_query, call\_llm)  
response \= generate\_response\_with\_kg\_context(user\_query\_example, None, None) \# Using mocked data

print(f"\\nLLM Response with KG Context:\\n{response}")

References: 2  
This conceptual example demonstrates a common GraphRAG pattern: query the KG based on the user's request, format the structured results from the KG into a textual context, and then feed this context along with the original query to an LLM to generate a natural language answer. Frameworks like LangChain and LlamaIndex provide tools to streamline such pipelines.23  
These Python examples, while conceptual in parts (especially LLM and Neo4j interactions which require live services), aim to provide practical starting points for Finntegrate's development team. They emphasize the integration of Finnish-specific NLP tools and the core logic for KG construction and querying. All code should use UTF-8 encoding to correctly handle Finnish characters.

### **IV. Graph RAG Implementation for Enhanced Contextual Understanding**

Implementing a Graph Retrieval Augmented Generation (GraphRAG) system will significantly enhance Finntegrate's ability to provide nuanced and contextually accurate information. This involves leveraging the structured knowledge within the KG to augment the context provided to the LLM, going beyond traditional vector-based RAG.

#### **A. Comparative Analysis of Graph RAG Architecture Options**

Several architectural patterns can be considered for implementing GraphRAG. The choice depends on factors like query complexity, desired latency, and available resources.

1. **Standard RAG (Vector-Only Baseline):** The user query retrieves semantically similar text chunks from a vector database. These chunks form the context for the LLM to generate an answer. This serves as a baseline for comparison.  
2. **Sequential Retrieval: KG then VectorDB (or vice-versa):**  
   * **KG-First:** The user query (or entities extracted from it) first queries the KG. The structured information retrieved (e.g., specific document names, related process steps) is then used to formulate a more targeted query for the vector database to fetch detailed textual explanations.  
   * **VectorDB-First:** The user query first retrieves relevant text chunks via vector search. Entities are extracted from these chunks. These entities then query the KG to find additional structured facts, relationships, or related entities that were not explicitly in the retrieved text but are contextually important. This enriched context (chunks \+ KG facts) is passed to the LLM. This is a common pattern.9  
3. **Hybrid Retrieval: Parallel Querying & Fusion:**  
   * The user query is processed to simultaneously query both the KG (for structured facts and relationships) and the vector database (for semantic text chunks).  
   * The results from both retrieval paths are then intelligently fused (e.g., by an LLM or a ranking algorithm) to create a comprehensive context for the LLM. This can reduce latency if queries can be parallelized but adds complexity in the fusion step.  
4. **LLM-Centric Agentic GraphRAG:**  
   * An LLM acts as an "agent" or orchestrator. Given a user query, the LLM decides the best strategy: query the vector DB, query the KG, query both, or even perform a sequence of queries (e.g., query KG, use results to refine vector search query, then query KG again with new entities found).  
   * Frameworks like LangChain and LlamaIndex support building such agents.11 This approach is highly flexible but can be more complex to implement and debug.  
5. **Specialized GraphRAG Methods:**  
   * **KG-based GraphRAG (LlamaIndex):** Extracts a KG from text and performs retrieval solely based on graph traversal from matched entities in the query.27  
   * **Community-based GraphRAG (Microsoft/LlamaIndex):** In addition to KG construction, hierarchical communities of nodes are detected. Retrieval can then happen at different levels: local search within communities (entities, relations, detailed reports) or global search using high-level community summaries.27 This can be effective for summarizing information over large document collections.

For Finntegrate, a **VectorDB-First Sequential Retrieval** or an **LLM-Centric Agentic approach (using LangChain/LlamaIndex)** appears most suitable. The former is simpler to start with, while the latter offers more power and flexibility as the system evolves. Community-based GraphRAG could also be valuable for providing summaries of complex bureaucratic areas.

**Table 3: Comparison of Graph RAG Architectural Patterns**

| Architectural Pattern                  | Description                                                                           | Typical Workflow                                                   | Key Tools/Frameworks (Illustrative)                | Pros for Finntegrate                                                                                 | Cons for Finntegrate                                                                                       | Suitability for Typical User Queries                                                                                  |
| :------------------------------------- | :------------------------------------------------------------------------------------ | :----------------------------------------------------------------- | :------------------------------------------------- | :--------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| **VectorDB-First Sequential**          | Vector search retrieves chunks; KG enriches with related facts.                       | Query → VectorDB → NER → KG Query → LLM                            | LangChain, LlamaIndex, Custom Python               | Simpler initial setup, leverages existing RAG. Good for grounding.                                   | Can be less efficient if KG holds primary answer.                                                          | Good for "What documents for X?" (KG adds precision) and "Tell me about Y" (KG adds related facts).                   |
| **KG-First Sequential**                | KG provides initial structure; VectorDB provides details.                             | Query → KG Query → VectorDB Query (refined) → LLM                  | LangChain, LlamaIndex, Custom Python               | Good for highly relational queries. Can narrow down search space for VectorDB.                       | Query might not always map well to initial KG query.                                                       | Excellent for "How does X relate to Y?" or "What are the steps for Z?".                                               |
| **Parallel Hybrid Retrieval & Fusion** | KG and VectorDB queried simultaneously; results merged.                               | Query → (KG Query                                                  |                                                    |                                                                                                      |                                                                                                            |                                                                                                                       |
| VectorDB Query) → Fusion → LLM         | Custom logic, potentially LLM for fusion                                              | Potentially lower latency if parallelizable.                       | Fusion logic can be complex. Resource intensive.   | Good for queries where both semantic text and structured facts are equally important from the start. |                                                                                                            |                                                                                                                       |
| **LLM-Centric Agentic**                | LLM decides retrieval strategy (KG, VectorDB, or both, iterative).                    | Query → LLM Agent → (KG/VectorDB/Tool) → LLM                       | LangChain Agents, LlamaIndex Query Engines/Routers | Highly flexible, adaptable to query type, can perform multi-step reasoning.                          | More complex to implement, debug, and control. Potential for higher latency due to LLM calls for planning. | Very powerful for complex, multi-faceted queries or conversational interactions.                                      |
| **Community-based GraphRAG** 27        | KG with community detection; retrieval via community summaries or local graph search. | Query → (Global Summary Search OR Local Entity Search in KG) → LLM | LlamaIndex (GraphRAGStore, GraphRAGExtractor)      | Good for holistic understanding of topics over large data. Provides summaries.                       | Overhead of community detection and summarization.                                                         | Useful for "Summarize the process for family reunification" or exploring related concepts within a bureaucratic area. |

#### **B. Advantages of Graph RAG over Traditional Vector-based RAG for Finntegrate**

GraphRAG offers several compelling advantages over traditional vector-based RAG, particularly for a complex domain like Finnish immigration procedures:

* **Precise Answers to Complex Relational Queries:** Traditional RAG struggles with queries that require understanding relationships between multiple entities or processes (e.g., "How does the work permit process relate to the residence permit process?" or "Which agencies are involved in both registering my address and applying for a Kela card?"). GraphRAG, by explicitly modeling these relationships in the KG, can traverse these connections and provide direct, accurate answers.9  
* **Improved Context Awareness:** KGs provide explicit, semantic relationships between entities, offering a deeper contextual understanding than the implicit semantic similarity captured by vector embeddings alone.7 This is crucial for navigating the interconnected steps and requirements of bureaucratic processes.  
* **Reduced Hallucinations:** By grounding LLM responses in factual, structured data retrieved from the KG, GraphRAG significantly reduces the likelihood of the LLM generating incorrect or unsubstantiated information ("hallucinations").43 This is vital when dealing with official procedures where accuracy is paramount.  
* **Navigating Multi-Step Processes:** Bureaucratic procedures are inherently sequential and involve dependencies. A KG can model these workflows (e.g., Process A PRECEDES Process B, Step X REQUIRES Document Y). GraphRAG can retrieve and present these entire pathways, guiding users more effectively than isolated text chunks.  
* **Handling Ambiguity:** Entities identified and disambiguated within the KG can help clarify ambiguous terms in user queries. For example, if a user asks about "avustus" (assistance/benefit), the KG can help narrow down whether they mean Kela benefits, TE-services support, etc., based on other query context or by presenting options derived from the graph.  
* **Enhanced Explainability and Trust:** While not fully "explainable AI," the paths traversed in a KG to arrive at an answer can offer a degree of transparency. Users (or developers) can potentially see *how* different pieces of information are connected, fostering more trust than opaque vector similarity scores.9  
* **Surfacing Implicit User Needs:** Immigrants may not know the correct official terminology or the full scope of interconnected processes. Vector RAG might retrieve documents based on keywords, but GraphRAG can explore related entities and processes in the KG. This allows the system to proactively offer relevant information that the user didn't explicitly ask for but is crucial for their situation (e.g., mentioning DVV registration when a user asks about a residence permit). This leads to more holistic support.

For Finntegrate, these advantages translate to a more reliable, accurate, and user-friendly support system that can effectively guide immigrants through complex and often daunting bureaucratic journeys.

#### **C. Implementation Patterns for Hybrid Retrieval (Vector Similarity and Graph Traversal)**

Hybrid retrieval combines the strengths of semantic vector search (for finding relevant text passages) and graph traversal (for exploring structured relationships and facts).

* **Pattern 1: Entity-Driven Graph Traversal after Vector Search (Enrichment)**  
  1. **Initial Retrieval:** The user's query is first used to perform a semantic search against the vector index of Markdown document chunks, retrieving the top N most relevant chunks.  
  2. **Entity Linking:** Named Entity Recognition (NER) is performed on the retrieved chunks (or the original user query) to identify key entities (e.g., "Migri," "oleskelulupa," "työsopimus"). These entities are then linked to their corresponding nodes in the KG.  
  3. **Graph Expansion:** Starting from these entity nodes in the KG, a graph traversal query (e.g., Cypher or SPARQL) is executed to find directly related information. This could involve fetching properties of the identified entities, finding directly connected entities (1-hop neighbors), or traversing short paths (e.g., 2-3 hops) to find indirectly related but contextually important information like required documents for a permit, or subsequent steps in a process.  
     * Example Cypher: MATCH (e:Entity {name\_fi: $entityName})--\>(relatedInfo) RETURN relatedInfo.name\_fi, relatedInfo.description\_fi  
  4. **Context Aggregation:** The textual content from the initially retrieved vector chunks is combined with the structured information (facts, relationships, entity properties) retrieved from the KG. This aggregated context is then passed to the LLM for response generation.  
* **Pattern 2: KG-Guided Vector Search (Refinement)**  
  1. **Initial Entity Identification:** NER is performed on the user's query to identify key entities.  
  2. **KG Keyword/Concept Expansion:** These entities are used to query the KG to find related keywords, synonyms, or names of closely associated concepts/processes. For example, if the user asks about "work permit," the KG might reveal related terms like "employee's residence permit" or specific application form codes.  
  3. **Augmented Vector Search:** The original user query is augmented with these additional terms retrieved from the KG. This enriched query is then used to perform a vector search, potentially leading to more relevant document chunks being retrieved.  
  4. **Context Aggregation:** The retrieved chunks (and potentially the KG facts used for augmentation) form the context for the LLM.  
* **Neo4j HybridCypherRetriever (and similar framework components):**  
  * Specialized retrievers, like those available in neo4j-graphrag package for Neo4j 45 or similar components in LangChain 25 and LlamaIndex 28, often encapsulate hybrid logic.  
  * The HybridCypherRetriever in Neo4j, for instance, can combine vector similarity search and full-text search on node properties to find initial relevant nodes. Then, a user-defined Cypher query is executed from these starting nodes to traverse the graph and fetch additional related data.45 This pattern is powerful for queries needing both semantic matching and specific graph structures.  
* **Dynamic Traversal Depth/Breadth:**  
  * Not all queries require the same depth or breadth of graph traversal. Simple factual queries might only need 1-hop neighbors, while comparative or process-flow queries might benefit from 2-3 hops or more.  
  * Over-traversal can introduce noise and increase latency.63  
  * The implementation should allow for configurable traversal depth. An advanced approach could involve using an LLM to analyze the query and determine an optimal traversal strategy or depth, or to adjust traversal based on the density of connections around the initial nodes found.

These patterns enable the GraphRAG system to leverage both the semantic understanding of LLMs/vector search and the explicit relational knowledge of the KG, leading to richer and more accurate context for generation.

#### **D. Suggested Evaluation Metrics for Assessing the Quality of Graph RAG System**

Evaluating a GraphRAG system requires assessing both the retrieval components (vector and graph) and the final generated output. A multi-faceted approach is necessary:

* **Retrieval Metrics (Assessing the "R" in RAG):**  
  * **Vector Retrieval:** Standard metrics like **Context Precision** and **Context Recall** (e.g., from the RAGAS framework 7) assess if the retrieved text chunks are relevant and contain the necessary information to answer the query.  
  * **Graph Retrieval Quality:** This is crucial for GraphRAG.  
    * **Chunk/Triple Evaluation (Greval-inspired):** Assess the relevance of individual KG elements (nodes, specific relationships, or entire paths/subgraphs) retrieved in response to a query. Categories like "Relevant," "Indirectly Relevant," or "Irrelevant" can be used.64 This helps identify if the KG querying part is effective.  
    * **Path Correctness/Completeness:** For queries requiring multi-hop reasoning, evaluate if the retrieved graph path is logically correct and complete according to domain knowledge.  
* **Generation Metrics (Assessing the "G" in RAG):**  
  * **Answer Faithfulness/Groundedness:** Measures whether the LLM's answer is factually consistent with the retrieved context (from both vector store and KG). This helps detect hallucinations. RAGAS includes a Faithfulness metric.7  
  * **Answer Relevancy/Quality:** Assesses how well the generated answer addresses the user's query, its clarity, and internal consistency. Greval's "Answer Quality" and "Answer Alignment" (if ground truth answers are available) are applicable here.64 RAGAS also has an Answer Relevancy metric.  
  * **Answer Completeness (Greval-inspired):** Evaluates if the answer incorporates all necessary information from the query and the relevant retrieved sources (both text chunks and KG triples/facts).64  
* **End-to-End System Metrics:**  
  * **Overall QA Correctness:** Human evaluation of a sample of query-answer pairs for factual accuracy and completeness.  
  * **Task Success Rate:** For typical immigrant user scenarios (e.g., "Find the requirements for a student residence permit"), can the user successfully obtain the correct and complete information using the system?  
  * **User Satisfaction:** Surveys or feedback mechanisms to gauge user perception of helpfulness, ease of use, and trustworthiness.  
* **Provenance/Traceability Metrics:**  
  * **Citation Accuracy:** If the system is designed to cite sources, how accurately does it link parts of the answer back to the specific source documents or KG nodes/relationships? This is important for user trust and verifiability.9  
* **Frameworks and Tools:**  
  * **RAGAS:** An open-source framework for evaluating RAG pipelines, offering metrics like Faithfulness, Answer Relevancy, Context Precision, and Context Recall.7  
  * **Greval (Lettria):** Provides a structured approach to evaluating GraphRAG components, including chunk and triple relevance, and answer alignment/quality/completeness.64 Finntegrate can adapt its principles.  
  * **LLM-as-a-Judge:** Using a powerful LLM (like GPT-4) to evaluate aspects like answer quality, coherence, and faithfulness, often guided by specific criteria and rubrics.

A key consideration for GraphRAG evaluation is to separately assess the graph retrieval component. If the KG retrieval is flawed (e.g., fetches an irrelevant subgraph or misses critical connections), the LLM will likely produce a poor answer, even if the LLM itself is capable. Isolating this helps pinpoint whether issues lie in KG construction, KG querying logic, or the LLM's generation capabilities. Regular evaluation using a combination of automated metrics and human oversight will be essential for iteratively improving the Finntegrate GraphRAG system.27

### **V. Knowledge Graph Visualization and User Experience**

Visualizing the knowledge graph and designing an intuitive user experience (UX) are critical for making the complex Finnish immigration system accessible to users. The goal is not to expose the entire KG, but to present relevant subgraphs and information pathways in a clear and actionable manner.

#### **A. Recommended Visualization Tools and Libraries**

The choice of visualization tools should prioritize open-source options that are web-friendly, interactive, and can be maintained by a small team.

* **Cytoscape.js:** A powerful open-source JavaScript library specifically designed for graph visualization and analysis in web applications.66 It is highly customizable, supports various layouts, and can interact with graph databases (e.g., via API calls to fetch data for visualization). Its interactivity features (zoom, pan, node selection, event handling) make it well-suited for user-facing applications like Finntegrate.  
* **D3.js:** A very flexible and powerful JavaScript library for creating dynamic, data-driven visualizations, including network graphs.67 It offers maximum control over the visual representation but has a steeper learning curve than more specialized graph libraries. For Finntegrate, D3.js could be used if highly custom visualizations are required, perhaps leveraging pre-built D3 graph layouts to reduce development time.  
* **Graphviz:** An open-source graph visualization software that takes textual descriptions of graphs (in DOT language) and generates diagrams.68 While primarily for static or less interactive visualizations, its Python bindings allow for programmatic generation of graph images, which could be useful for embedding diagrams in explanations or for developer-side analysis.  
* **Gephi:** A leading open-source platform for graph visualization and exploration.69 It's excellent for in-depth analysis, applying metrics, and creating high-quality static visualizations by developers or analysts. However, it's a desktop application and less suited for direct embedding into a user-facing web application. It can be used for backend exploration and understanding of the KG structure.  
* **RAWGraphs:** An open-source web tool that allows users to easily create various chart types, including some hierarchical visualizations.70 While user-friendly, its capabilities might be too limited for visualizing the complex, interconnected nature of the Finntegrate KG.

Selection Rationale for Finntegrate:  
For interactive, user-facing visualizations embedded within the Finntegrate web application, Cytoscape.js stands out as a strong candidate due to its web-native nature, rich interactivity, customizability, and focus on graph structures.66 D3.js offers more power but at the cost of complexity. Gephi can be a valuable tool for the development team to explore and analyze the KG internally.  
**Table 4: Recommended Open-Source Knowledge Graph Visualization Tools**

| Tool/Library        | Key Features                                                                                                          | Ease of Web Integration                      | Suitability for Bureaucratic Processes                                               | Open-Source License                           | Learning Curve/Maintainability   |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------- | :------------------------------------------- | :----------------------------------------------------------------------------------- | :-------------------------------------------- | :------------------------------- |
| **Cytoscape.js** 66 | Highly interactive (zoom, pan, select, drag), rich layouts, customizable styling, event handling, data import/export. | Excellent (JavaScript library for web apps)  | Good for showing relationships, process flows if data is structured appropriately.   | MIT or LGPL (depending on version/components) | Moderate                         |
| **D3.js** 67        | Extremely flexible, data-driven DOM manipulation, supports custom network graph creation, animations.                 | Excellent (JavaScript library)               | High, but requires significant custom development to model processes effectively.    | BSD                                           | Steep                            |
| **Graphviz** 68     | Generates static graph layouts from DOT language. Various layout algorithms.                                          | Limited (generates images/SVG for embedding) | Fair for simpler flowcharts or static representations of dependencies.               | Common Public License 1.0                     | Low (for basic use)              |
| **Gephi** 69        | Exploratory data analysis, metrics, dynamic filtering, spatialization, high-quality static outputs.                   | Poor (Desktop application)                   | Good for backend analysis of process complexity, identifying bottlenecks.            | GPLv3, CDDL                                   | Moderate (for advanced features) |
| **RAWGraphs** 70    | Web-based, easy to use, various chart types including some for hierarchies.                                           | Good (Web application, can export SVG)       | Limited for complex, interconnected KG structures typical of bureaucratic processes. | Apache 2.0                                    | Low                              |

#### **B. Intuitive Presentation of the Knowledge Graph to Users**

Presenting a knowledge graph effectively to end-users, especially those navigating complex bureaucratic information, requires careful design to avoid overwhelming them.

* **Task-Oriented and Query-Driven Views:** Instead of displaying the entire KG, visualizations should be dynamically generated or filtered to show only the subgraph relevant to the user's current query or selected task.71 For example, if a user asks "What documents do I need for a student residence permit?", the visualization should focus on the "Student Residence Permit" process node, its connected "Document" requirement nodes, and perhaps the "Agency" responsible.  
* **Clear and Simple Visual Language:**  
  * **Node and Edge Labeling:** Use clear, concise labels in the user's chosen language (Finnish, English, or Swedish). Avoid jargon where possible or provide tooltips with explanations.  
  * **Visual Differentiation:** Employ distinct colors, shapes, or icons for different entity types (e.g., blue squares for Agency, green circles for Process, yellow rectangles for Document). This helps users quickly understand the roles of different elements in the graph.  
  * **Layouts:** Use layouts that enhance clarity. For processes, a directed acyclic graph layout (flowchart-like) might be more intuitive than a force-directed layout if a clear sequence exists.66 Hierarchical layouts can show dependencies.  
* **Progressive Disclosure and Interactivity:**  
  * Start with a high-level overview and allow users to drill down for more details. Clicking on a node could expand to show its properties, connected nodes, or link to the source document section.67  
  * Provide tooltips on hover for nodes and edges to display additional information without cluttering the main view.67  
  * Allow users to expand or collapse branches of the graph to manage complexity.  
* **Storytelling and Guided Navigation:** For common or particularly complex processes, the system could offer a guided tour through the relevant KG path, explaining each step and its connections.  
* **Search and Filtering within Visualization:** Enable users to search for specific entities within the current view or filter the displayed graph based on criteria (e.g., "show only mandatory documents").  
* **Contextual Explanations:** Accompany visualizations with natural language explanations generated by the RAG system, summarizing what the visualized subgraph represents in the context of the user's query.

The key is to transform the KG from a complex data structure into a user-friendly map that simplifies the understanding of bureaucratic procedures.63 The visualization should directly answer the user's implicit or explicit question, rather than merely being a browser for the graph data.

#### **C. Beneficial Interaction Patterns for Immigrants Navigating the System**

Interaction patterns should empower users to find information efficiently and understand the relationships within the Finnish immigration system.

* **Conversational Querying with Visual Augmentation:** Users should be able to ask questions in natural language (Finnish, English, or Swedish). The system (GraphRAG) provides a textual answer, supplemented by an interactive visualization of the relevant KG subgraph that supports the answer. This combines the ease of conversation with the clarity of visual representation.73  
* **Step-by-Step Process Guidance:** When a user selects or asks about a specific immigration process (e.g., "applying for first residence permit"), the system should visualize the sequence of Step nodes, highlighting the current or next actionable step. Each step node can be clicked to reveal associated Requirements, Documents, and Agency interactions.  
* **"What's Next?" or "What's Related?" Exploration:** Clicking on an entity in the KG (e.g., a submitted "Application Form" document node) could trigger actions or display options like "Show next steps in the process" or "Show related documents and agencies." This allows for intuitive, explorative navigation.  
* **Interactive Checklists:** For processes with multiple requirements or documents, these can be presented as an interactive checklist derived from the KG. Clicking an item on the checklist could reveal more details from the KG (e.g., specific criteria for a requirement, where to obtain a document) and link to the relevant source information.  
* **Comparative Views:** Users often need to compare processes (e.g., "requirements for family reunification vs. work-based immigration"). The system could retrieve the relevant subgraphs for both processes and present them side-by-side, highlighting differences in steps, requirements, or timelines.  
* **Personalized Views (Future Enhancement):** If user profiles are implemented (with user consent and privacy considerations), the KG views could be filtered and personalized based on the user's specific situation (e.g., nationality, purpose of stay, family status). For example, the system could automatically hide requirements that don't apply to a particular user category.74  
* **Direct Links to Actions/Sources:** Nodes representing documents or agency services should provide direct links to download forms, access online application portals, or view the original source page on the government website. This makes the KG actionable.

These interaction patterns aim to reduce the cognitive load on users by breaking down complex information into manageable, interconnected pieces and guiding them through the system based on their needs.63

#### **D. Incorporating User Feedback for Knowledge Graph Improvement**

User feedback is invaluable for the iterative refinement and improvement of both the KG's accuracy and completeness, and the RAG system's effectiveness.

* **Explicit Feedback Mechanisms:**  
  * **Content Rating:** Simple "Was this information helpful?" (thumbs up/down) or star ratings on answers generated by the RAG system or on specific information nodes viewed in the KG.  
  * **Error Reporting/Suggestion Box:** Allow users to report perceived errors (e.g., "This document is no longer required," "This link is broken") or suggest missing information related to a specific process, document, or agency they are viewing. A simple form tied to the current context (e.g., the KG node ID or query) would be effective.  
  * **Proposing New Entities/Relationships:** Advanced users or community moderators (if applicable in the future) could be given tools to suggest new entities or relationships that they believe are missing from the KG.  
* **Implicit Feedback Collection:**  
  * **Query Analysis:** Track user queries that yield no results, poor quality results (based on low ratings or quick abandonment), or lead to users rephrasing multiple times. These indicate gaps in the KG or issues with query understanding/retrieval.  
  * **Navigation Path Analysis:** Analyze how users navigate through visualized KG subgraphs. Frequently followed paths might indicate common information needs, while points where users frequently backtrack or abandon exploration could indicate confusion or missing links.  
  * **Click-Through Rates:** For links provided from KG nodes (e.g., to source documents or agency websites), track which links are most frequently used.  
* **Human-in-the-Loop (HITL) KG Refinement Process:**  
  * **Feedback Triage:** Collected feedback (both explicit and implicit signals) should be directed to a dashboard or queue for review by the Finntegrate development team or designated domain experts.  
  * **Validation and Correction:** Reviewers validate the feedback. If an error in the KG is confirmed (e.g., an outdated requirement, a missing document), they can directly edit the KG using an administrative interface or by updating the source data and re-running the extraction pipeline for the affected parts. Discrepancies between LLM outputs, KG content, and user observations can trigger this HITL refinement.76  
  * **Ontology Evolution:** Consistent feedback about missing types of information or unclear relationships can inform necessary extensions or modifications to the KG schema/ontology.  
  * **Extraction Rule/Prompt Improvement:** If feedback indicates systematic errors in how information is extracted from source documents, the NER/RE rules or LLM prompts need to be refined.  
* **Continuous Improvement Cycle:**  
  * User feedback should not be a one-time collection but an ongoing process.74 The KG and the RAG system are living entities that must adapt to changes in Finnish immigration laws and procedures, as well as to a better understanding of user needs.  
  * This feedback loop is critical for maintaining the accuracy, completeness, and relevance of the Finntegrate system over time.63

The feedback mechanism should be designed to capture sufficient context (e.g., the user's query, the specific KG nodes/relationships being viewed or used by RAG) to allow developers to effectively diagnose whether an issue stems from the KG data itself, the KG schema, the extraction process, or the RAG system's retrieval and generation logic. This targeted diagnosis enables more efficient correction and improvement.

### **Implementation Roadmap**

This section outlines a phased implementation roadmap for developing and deploying the knowledge graph and GraphRAG system for Finntegrate. The roadmap prioritizes iterative development, allowing for continuous learning and adaptation, and is mindful of the project's constraints (small team, limited resources).

* **Phase 1: Foundational Setup & Core Finnish NLP (Months 1-2)**  
  * **Objective:** Establish the development environment and core NLP processing capabilities for Finnish.  
  * **Tasks:**  
    1. Set up project infrastructure: Version control (Git), development environment, issue tracking.  
    2. Select and integrate core Finnish NLP tools:  
       * Install and test the **Turku Neural Parser Pipeline** for tokenization, lemmatization, morphological analysis (including compound handling), and dependency parsing.4  
       * Optionally, set up **Omorfi** for more detailed morphological analysis if deemed necessary after initial tests with TurkuNLP.14  
    3. Develop initial data ingestion scripts for loading and preprocessing the Markdown files from government sources.  
    4. Experiment with Named Entity Recognition (NER) on a sample of bureaucratic text:  
       * Utilize a pre-trained Finnish NER model like **Kansallisarkisto/finbert-ner**.5  
       * Perform initial tests and identify needs for fine-tuning or custom entity definitions.  
    5. Define Version 1.0 of the Knowledge Graph schema/ontology based on Finntegrate's core entity list (Immigration processes, Government agencies, Document types, Legal requirements, etc.) and by studying existing resources like the Suomi.fi PTV model 32 and Migri's glossary.31  
    6. Select and set up the chosen Knowledge Graph database (e.g., Neo4j Community Edition).  
  * **Deliverables:** Basic NLP pipeline for Finnish text; initial KG schema; KG database instance ready.  
* **Phase 2: Knowledge Graph Construction \- Core Entities & Relationships (Months 3-5)**  
  * **Objective:** Begin populating the KG with core information and implement basic provenance.  
  * **Tasks:**  
    1. Develop and refine NER models/prompts for the core entity types defined in the schema. This may involve initial fine-tuning of FinBERT on a small annotated set of Finntegrate's documents.  
    2. Implement initial Relationship Extraction (RE) capabilities:  
       * Start with rule-based RE leveraging dependency parse outputs for high-precision extraction of common relationships.  
       * Experiment with LLM-prompting for RE for more complex or less structured relations.  
    3. Build Python scripts to transform extracted entities and relationships into the KG database format (e.g., using RDFLib for RDF or the Neo4j Python driver).  
    4. Implement basic provenance tracking: Ensure each extracted node/relationship in the KG has properties linking it back to the source Markdown file and ideally a section/paragraph identifier.  
    5. Begin populating the KG with data from a limited subset of agencies (e.g., focusing on Migri documentation first).  
    6. Iteratively refine the KG schema based on initial extraction results and challenges.  
  * **Deliverables:** A partially populated KG with core entities and relationships from one agency; basic provenance links; refined NER/RE components.  
* **Phase 3: Basic RAG & KG Integration (Months 6-7)**  
  * **Objective:** Integrate the KG with the existing vector-based RAG system to create a basic GraphRAG.  
  * **Tasks:**  
    1. Implement a basic hybrid retrieval strategy (e.g., vector search followed by KG lookup for entity enrichment, as per Pattern 1 in Section IV.C).  
    2. Develop simple query patterns (SPARQL or Cypher) to retrieve relevant information from the KG based on entities identified in user queries or retrieved text chunks.  
    3. Adapt the LLM prompting strategy to incorporate context derived from the KG.  
    4. Conduct initial evaluations comparing the performance (accuracy, relevance) of the basic GraphRAG system against the original vector-only RAG.  
  * **Deliverables:** A functional basic GraphRAG system; initial performance benchmarks.  
* **Phase 4: Advanced GraphRAG & Multilingual Support (Months 8-10)**  
  * **Objective:** Enhance the GraphRAG system and implement multilingual capabilities.  
  * **Tasks:**  
    1. Implement a more sophisticated GraphRAG architecture, potentially using LangChain or LlamaIndex for better orchestration and advanced retrieval patterns.24  
    2. Refine hybrid retrieval strategies, possibly incorporating KG-guided vector search or dynamic traversal depth.  
    3. Implement multilingual support in the KG: Store labels and descriptions for entities and relationships in Finnish, English, and Swedish.  
    4. Integrate Helsinki-NLP Opus-MT models 39 for translating terms or content snippets where necessary.  
    5. Adapt the RAG system's front-end and LLM prompting to handle multilingual queries and present information in the user's preferred language.  
    6. Develop a more comprehensive evaluation framework for GraphRAG, including metrics for KG retrieval quality and answer faithfulness.64 Conduct thorough testing.  
  * **Deliverables:** An advanced GraphRAG system with multilingual support; refined retrieval and generation; comprehensive evaluation results.  
* **Phase 5: Visualization & User Feedback (Months 11-12)**  
  * **Objective:** Develop user-facing KG visualizations and implement feedback mechanisms.  
  * **Tasks:**  
    1. Select and integrate a suitable open-source graph visualization library (e.g., Cytoscape.js 66) into the Finntegrate web application.  
    2. Develop initial task-oriented KG visualizations for key immigration processes (e.g., showing steps, required documents, involved agencies for a specific permit).  
    3. Implement basic user feedback mechanisms within the application (e.g., rating answer helpfulness, simple error reporting forms).  
    4. Design and develop a basic administrative interface or process for the Finntegrate team to review user feedback and make corrections or updates to the KG (Human-in-the-Loop refinement).  
  * **Deliverables:** Interactive KG visualizations for key use cases; user feedback collection system; initial HITL process for KG maintenance.  
* **Ongoing: Iteration, Expansion, Maintenance (Post 12 Months)**  
  * **Objective:** Continuously improve and expand the system.  
  * **Tasks:**  
    1. Incrementally ingest and process documentation from other relevant agencies (Kela, TE-services, DVV, etc.).  
    2. Continuously refine the KG ontology, extraction rules/prompts, and GraphRAG strategies based on ongoing evaluation and user feedback.  
    3. Monitor system performance, resource usage, and costs.  
    4. Keep NLP models and software libraries updated.  
    5. Adapt to changes in Finnish immigration laws and procedures by updating source data and the KG.

This roadmap provides a structured approach to a complex project, balancing ambition with the practical constraints faced by the Finntegrate team. Each phase builds upon the previous one, allowing for demonstrable progress and iterative improvement.

## **Conclusion and Recommendations**

The Finntegrate project's goal of creating an accessible, multilingual support system for immigrants in Finland can be significantly advanced by the strategic implementation of a knowledge graph (KG) to enhance its existing RAG system. This report has detailed a comprehensive approach, focusing on open-source tools, Finnish language processing intricacies, and practical implementation strategies tailored to Finntegrate's resources and objectives.

**Key Recommendations:**

1. **Adopt a Phased, Iterative Approach:** Begin with a core set of Finnish NLP tools (Turku Neural Parser Pipeline, fine-tuned FinBERT for NER) and a foundational KG schema. Incrementally expand data sources, refine the ontology, and enhance GraphRAG capabilities based on continuous evaluation and user feedback. This mitigates risk and allows the small team to manage complexity effectively.  
2. **Prioritize Finnish Language Processing:** Invest in robust Finnish NLP. Accurate morphological analysis (compound splitting, case normalization via TurkuNLP/Omorfi) and domain-adapted NER (fine-tuning FinBERT on bureaucratic text) are prerequisites for high-quality KG construction and effective retrieval.  
3. **Embrace Hybrid Extraction and Retrieval:** For relationship extraction, combine rule-based methods (leveraging dependency parses for precision in formal text) with LLM-based approaches (for broader coverage). For GraphRAG, implement hybrid retrieval that synergizes vector search with KG traversal to provide comprehensive and accurate context to the LLM.  
4. **Develop a Domain-Specific Ontology with Strong Provenance:** Design a KG schema centered on core immigration concepts (Process, Agency, Document, Requirement, Step), drawing inspiration from PTV and Migri. Crucially, embed robust provenance by structurally linking all extracted KG elements back to their precise source in the Markdown documents.  
5. **Select Open-Source and Maintainable Technologies:** Neo4j (Community Edition) is recommended for the KG database due to its maturity, Python support, and GraphRAG ecosystem. For NLP, leverage the TurkuNLP and Helsinki-NLP toolkits. LangChain and/or LlamaIndex should be used for building the GraphRAG pipeline. Cytoscape.js is suitable for user-facing visualizations.  
6. **Focus on Task-Oriented User Experience:** KG visualizations should not be generic graph browsers but rather dynamic, interactive displays focused on specific user tasks (e.g., understanding a permit process). Combine conversational interaction with these targeted visualizations.  
7. **Implement a Robust User Feedback Loop:** Collect explicit and implicit user feedback to drive the continuous improvement of the KG's accuracy and completeness, as well as the GraphRAG system's performance. Establish a human-in-the-loop process for validating and incorporating these corrections.  
8. **Manage Multilingualism Systematically:** Store multilingual labels (Finnish, English, Swedish) as distinct properties in the KG. Utilize Helsinki-NLP Opus-MT for translations where necessary. Ensure the RAG system can process multilingual queries and present information appropriately.

By following these recommendations, Finntegrate can construct a powerful knowledge graph that transforms unstructured bureaucratic documentation into actionable, structured knowledge. This will enable the GraphRAG system to provide significantly more accurate, context-aware, and helpful support to immigrants, easing their navigation of complex Finnish administrative processes. The emphasis on open-source tools and an iterative development lifecycle ensures that the solution remains maintainable and adaptable for the future.

## **References**

* 19 thunlp/OpenNRE. GitHub.  
* 80 Kiiskinen, H., Nivala, A., Westerlund, J., & Saarelainen, J. (n.d.). *Extracting geographical information from Finnish literature 1870-1940*. Journal of Computing and Cultural Heritage (JOCCH).  
* 81 TurkuNLP. (n.d.). *TurkuNLP Group*. University of Turku.  
* 3 TurkuNLP. (n.d.). *Finnish Dependency Parser*. University of Turku.  
* 38 University of Helsinki. (n.d.). *Research and Publications*. Helsinki NLP.  
* 82 Helsinki-NLP. (n.d.). *Repositories*. GitHub.  
* 17 Anonymous. (2023). *FinGPT: Large Language Models for Finnish*. OpenReview.  
* 16 Pyysalo, S., et al. (2023). *FinGPT: Large Language Models for Finnish*. Proceedings of the 2023 Conference on Empirical Methods in Natural Language Processing.  
* 83 Räsänen, O., et al. (n.d.). *Bilingual tests with Swedish, Finnish and German queries*.  
* 52 Travis, L. (2017, October 19). *Compounding in Finnish*. Blog post.  
* 84 Vera Institute of Justice. (n.d.). *Legal Resources for Immigrants, Advocates, Journalists, and Lawmakers*.  
* 85 Valente, A. (n.d.). *Ontologies in the Legal Domain*.  
* 7 FalkorDB. (2024, September 30). *How to Build a Knowledge Graph: A Step-by-Step Guide*. FalkorDB Blog.  
* 34 ONTOFORCE. (n.d.). *Best practices: Knowledge graphs to enhance and achieve AI & machine learning*. ONTOFORCE Blog.  
* 2 Neo4j. (2024, April 19). *Constructing Knowledge Graphs From Unstructured Text Using LLMs*. Neo4j Developer Blog.  
* 11 Neo4j. (n.d.). *Creating Knowledge Graphs from Unstructured Data*. Neo4j GenAI Ecosystem.  
* Kettunen, K., et al. (2024). *Named Entity Recognition for Digitised Finnish State Authority Documents*. University of Jyväskylä.  
* 56 Papers with Code. (n.d.). *Relation Extraction*.  
* 42 Coreon. (n.d.). *Multilingual Knowledge System*.  
* 86 GitHub Issue. (2024). *Multilingual Knowledge Graph Construction*. HKUDS/LightRAG.  
* 23 DataCamp. (n.d.). *Knowledge Graph RAG Tutorial*.  
* 43 Aerospike. (n.d.). *Introduction to Graph RAG*. Aerospike Blog.  
* 87 RAGabout.it. (n.d.). *Graph RAG Architecture*.  
* 44 Rodriguez, M. (2024, September 4). *Unlocking Smarter AI with GraphRAG*. Mosaic Data Science.  
* 45 Neo4j Graph Academy. (n.d.). *Hybrid Cypher Retriever*. GenAI Workshop GraphRAG.  
* 46 Neo4j. (2024, September 24). *Enhancing Hybrid Retrieval with the GraphRAG Python Package*. Neo4j Developer Blog.  
* 27 Zhang, Y., et al. (2025). *Evaluating RAG and GraphRAG on Text-based Tasks*. arXiv.  
* 64 Lettria. (2025, May 7). *Greval: An Evaluation Tool for Lettria's GraphRAG*. Lettria Lab.  
* 69 Gephi. (n.d.). *Gephi \- The Open Graph Viz Platform*.  
* 70 RAWGraphs. (n.d.). *RAWGraphs \- The missing link between spreadsheets and data visualization*.  
* 63 Smythos. (2025, January 31). *Knowledge Graph Tutorial*. Smythos AI Agents.  
* 72 Hypermode. (2025, April 3). *Build a Knowledge Graph for Your AI Applications*. Hypermode Blog.  
* 77 Lettria. (n.d.). *How to Build a Knowledge Graph in 9 Simple Steps*. Lettria Blog.  
* 74 Kumar, A., et al. (2025). *Personalized Messaging using Knowledge Graphs and LLMs*. arXiv.  
* 15 TurkuNLP. (n.d.). *Finnish NLP Resources*. University of Turku.  
* 48 TurkuNLP. (n.d.). *Finnish NER*. University of Turku.  
* 88 Silfverberg, M., et al. (2024). *LASTU: A tool for searching Finnish language stimulus words*. PLOS ONE.  
* 89 Silfverberg, M., & Alnajjar, K. (2018). *Development of an Open Source Natural Language Generation Tool for Finnish*. Proceedings of the Workshop on Computational Creativity in Natural Language Generation.  
* 53 Kunnas, K. (2022). *Low-resource Named Entity Recognition using BERT-based models and Ensemble Learning*. University of Jyväskylä.  
* 54 Luoma, J. (2020). *Cross-Sentence Information for Named Entity Recognition with BERT*. University of Turku.  
* 90 Virén, M. (2022). *The fiscal consequences of immigration: a study of local governments' expenditures*. Review of Regional Research.  
* 91 Sorman, G. (2016). *The Finnish Model*. City Journal.  
* 20 Sematext. (n.d.). *Entity Extraction with spaCy*. Sematext Blog.  
* 92 Prodigy Support. (n.d.). *Training a relation extraction component*.  
* 93 TurkuNLP. (n.d.). *NER Introduction Notebook*. Text Mining Course GitHub.  
* 18 Janhunen, J., et al. (2025). *Extracting Structured Data from Finnish Dialect Interviews with Large Language Models*. arXiv.  
* 6 GeeksforGeeks. (n.d.). *Relationship Extraction in NLP*.  
* 21 Towards Data Science. (n.d.). *Relation Extraction with Llama3 Models*.  
* 22 RDFLib Documentation. (n.d.). *Getting started with RDFLib*.  
* 12 FareedKhan-dev. (n.d.). *Big Data with KG*. GitHub.  
* 94 YouTube. (n.d.). *NetworkX Knowledge Graph Example (Pokemon Types)*.  
* 95 YouTube. (n.d.). *Knowledge Graph with spaCy and NetworkX*.  
* 8 Neo4j. (n.d.). *How to Build a Knowledge Graph*. Neo4j Blog.  
* 58 PageOne.ai. (n.d.). *How to Build a Knowledge Graph: Step-by-Step Guide*.  
* 59 Milvus. (n.d.). *What is SPARQL and how is it used with knowledge graphs?*.  
* 60 YouTube. (n.d.). *SPARQL Query Example (Poets)*.  
* 61 Databricks. (n.d.). *Building, Improving, and Deploying Knowledge Graph RAG Systems with Databricks*. Databricks Blog.  
* 62 Neo4j Cypher Manual. (n.d.). *Basic Queries*.  
* 65 Chitika. (n.d.). *GraphRAG: Origin, Uses, Implementation and More*.  
* 9 Neo4j. (n.d.). *The GraphRAG Manifesto*. Neo4j GenAI Blog.  
* 66 PuppyGraph. (n.d.). *Popular Tools for Knowledge Graph Visualization*. PuppyGraph Blog.  
* 68 Instructor. (n.d.). *Knowledge Graph Generation and Visualization with OpenAI and Graphviz*.  
* 63 Smythos. (2025, January 31). *Knowledge Graph Tutorial (Re-cited)*. Smythos AI Agents. *63*  
* 73 PromptEngineering.org. (n.d.). *Knowledge Graphs in AI Conversational Models*.  
* 13 Silfverberg, M., Ruokolainen, T., Lindén, K., & Kurimo, M. (2016). *FinnPos: an open-source morphological tagging and lemmatization toolkit for Finnish*. ResearchGate.  
* 96 JatinnG. (n.d.). *NLP\_Compound\_Word\_Splitter*. GitHub.  
* 97 Partanen, N., et al. (2019). *Dialect Text Normalization to Normative Standard Finnish*. Proceedings of the 22nd Nordic Conference on Computational Linguistics.  
* 98 Hämäläinen, M. (2021). *Finnish Dialect Text Normalisation Using Neural Machine Translation*. University of Helsinki.  
* 28 Memgraph. (n.d.). *Single Agent RAG System with LlamaIndex and Memgraph*. Memgraph Blog.  
* 29 LlamaIndex Documentation. (2024, May 16). *GraphRAG Implementation with LlamaIndex \- V2*.  
* 24 FalkorDB. (n.d.). *A Guide to Implementing a GraphRAG Workflow Using FalkorDB, LangChain and LangGraph*. FalkorDB Blog.  
* 25 LangChain Documentation. (n.d.). *Graph RAG Retriever*.  
* 99 OECD OPSI. (n.d.). *Suomi.fi Quality Tools*.  
* 32 Interoperable Europe. (n.d.). *Suomi.fi Finnish Service Catalogue*. European Commission.  
* 22 RDFLib Documentation. (n.d.). *Getting started with RDFLib (Re-cited)*. *22*  
* 35 RDFLib Documentation. (n.d.). *RDF terms in rdflib*.  
* 8 Neo4j. (n.d.). *How to Build a Knowledge Graph (Re-cited)*. Neo4j Blog. *8*  
* 37 DataCamp. (n.d.). *Knowledge Graphs and LLMs*. DataCamp Blog.  
* 100 Analytics Vidhya. (2025, March). *Traditional RAG vs. Graph RAG*.  
* 26 Walturn. (n.d.). *Retrieval Augmented Generation (RAG): Bridging LLMs with External Knowledge*.  
* 71 CEUR Workshop Proceedings. (n.d.). *Semantic Digital Library for Bureaucratic Procedures*.  
* 63 Smythos. (2025, January 31). *Knowledge Graph Tutorial (Re-cited)*. Smythos AI Agents. *63*  
* 75 ResearchGate. (n.d.). *Intro to AI Agents Discussion*.  
* 101 ResearchGate Publication. (2020). *Biclustering high-frequency MeSH terms*.  
* 102 ResearchGate Publication. (2021). *Semantic data driven approach for merchandizing optimization*.  
* 103 EURECOM Publication. (n.d.). *Knowledge Graph Multi-Task Learning for Recommendation*.  
* 4 TurkuNLP. (n.d.). *Turku Neural Parser Pipeline Documentation*.  
* 104 TurkuNLP. (n.d.). *Turku-neural-parser-pipeline GitHub Repository*.  
* 14 flammie. (n.d.). *Omorfi GitHub Repository*.  
* 51 flammie. (n.d.). *Omorfi API Design*.  
* 49 Lindén, K., et al. (n.d.). *HFST – A System for Creating NLP Tools*.  
* 50 ResearchGate Publication. (n.d.). *HFST \- A System for Creating NLP Tools 49*.  
* 105 arXiv. (2025). *LLMs for Historical NER*.  
* 6 GeeksforGeeks. (n.d.). *Relationship Extraction in NLP (Re-cited)*. *6*  
* 39 arXiv. (2025). *OpusDistillery: A Framework for Knowledge Distillation of Multilingual NMT Models*.  
* 40 Toolify.ai. (n.d.). *Helsinki-NLP Opus-MT-TC-BIG-EN-ES Model Information*.  
* 106 Suomi.fi Developers. (n.d.). *Suomi.fi Finnish Service Catalogue*.  
* 107 Synergia Foxy. (n.d.). *PTV Integration with Synergia Foxy CMS*.  
* 5 Hugging Face. (n.d.). *Kansallisarkisto/finbert-ner Model Card*.  
* 4 TurkuNLP. (n.d.). *Turku Neural Parser Pipeline Documentation (Re-cited)*. *4*  
* 108 Spot Intelligence. (2023, January 25). *Text Normalization Techniques in NLP with Python*.  
* 109 YouTube. (n.d.). *Database Normalization Explanation*.  
* 110 Laitinen, T. (2023). *Fine-tuning Language Models for Named Entity Recognition in Finnish Cardiology Texts*. Tampere University.  
* 57 Rajpoot, P. K., & Parikh, A. (2023). *GPT-FinRE: In-context Learning for Financial Relation Extraction using Large Language Models*. arXiv.  
* 9 Neo4j. (n.d.). *The GraphRAG Manifesto (Re-cited)*. Neo4j GenAI Blog. *9*  
* 30 LlamaIndex Documentation. (n.d.). *Metadata Extraction Cookbook*.  
* 111 Frontiers in Physics. (2025). *GNSS-Based UAV Attitude Measurement*.  
* 112 DHS.gov. (n.d.). *AI Use Case Inventory: CBP*.  
* 113 ResearchGate Publication. (n.d.). *Beyond Conversational Artificial Intelligence*.  
* 78 Journal of Engineering Design. (2025). *A dynamically updatable knowledge graph construction method*.  
* 114 Inria. (2024). *Wimmics Activity Report*.  
* 115 TurkuNLP. (n.d.). *FinBERT Hugging Face Transformers Guide*. GitHub.  
* 116 Hugging Face. (n.d.). *TurkuNLP/sbert-cased-finnish-paraphrase Model Card*.  
* 6 GeeksforGeeks. (n.d.). *Relationship Extraction in NLP (Re-cited)*. *6*  
* 117 PMC NCBI. (n.d.). *Cross-Lingual Alignment of Large Language Models*.  
* 33 Suomi.fi Palvelutietovaranto API. (n.d.). *Swagger UI*.  
* 118 Suomi.fi Palvelutietovaranto Test API. (n.d.). *Swagger UI*.  
* 76 arXiv. (2025). *Human-in-the-Loop Knowledge Graph Refinement for Assistive Agents*.  
* 79 Semantic Web Journal. (n.d.). *Explainable Knowledge Graph Construction with Humans In-the-Loop*.  
* 67 Tom Sawyer Software. (n.d.). *JavaScript Graph Visualization with D3.js*.  
* 119 ServiceNow. (n.d.). *Exploring Knowledge Graph*.  
* 120 MDPI. (n.d.). *Current Trends in Natural Language Processing (NLP) and Human Language Technology (HLT)*.  
* 121 arXiv. (2024). *Domain Adaptation for Financial Sentiment Analysis*.  
* 122 TEI Consortium. (2019). *TEI and Knowledge Modelling*.  
* 123 ResearchGate Topic. (n.d.). *Relational Databases Publications*.  
* 10 ResearchGate Publication. (2020). *Dictionary of disease ontologies (DODO)*.  
* 124 ResearchGate Publication. (n.d.). *Enhancing Scientific Reproducibility Through Automated BioCompute Object Creation*.  
* 47 CoNLL 2018 Shared Task. (2018). *Turku NLP Pipeline for Multilingual Parsing*.  
* 55 TurkuNLP. (n.d.). *Elementary Text Processing Notebook*. Text Mining Course GitHub.  
* 125 HFST GitHub. (n.d.). *ChangeLog*.  
* 81 TurkuNLP. (n.d.). *TurkuNLP Group (Summary)*.  
* 82 Helsinki-NLP. (n.d.). *Repositories (Summary)*. GitHub.  
* 16 Pyysalo, S., et al. (2023). *FinGPT: Large Language Models for Finnish (Summary)*.  
* Kettunen, K., et al. (2024). *Named Entity Recognition for Digitised Finnish State Authority Documents (Summary)*.  
* 2 Neo4j. (2024, April 19). *Constructing Knowledge Graphs From Unstructured Text Using LLMs and Neo4j (Summary)*.  
* 46 Neo4j. (2024, September 24). *Enhancing Hybrid Retrieval with the GraphRAG Python Package (Summary)*.  
* 64 Lettria. (2025, May 7). *Greval: An Evaluation Tool for Lettria's GraphRAG (Summary)*.  
* 7 FalkorDB. (2024, September 30). *How to Build a Knowledge Graph: A Step-by-Step Guide (Summary)*.  
* 34 ONTOFORCE. (n.d.). *Best practices: Knowledge graphs to enhance and achieve AI & machine learning (Summary)*.  
* 56 Papers with Code. (n.d.). *Relation Extraction (Summary)*.  
* 69 Gephi. (n.d.). *Gephi \- The Open Graph Viz Platform (Summary)*.  
* 70 RAWGraphs. (n.d.). *RAWGraphs \- The missing link between spreadsheets and data visualization (Summary)*.  
* 63 Smythos. (2025, January 31). *Knowledge Graph Tutorial (Summary)*.  
* 72 Hypermode. (2025, April 3). *Build a Knowledge Graph for Your AI Applications (Summary)*.  
* 15 TurkuNLP. (n.d.). *Finnish NLP Resources (Summary of Python examples availability)*.  
* 31 Migri. (n.d.). *Glossary (Summary)*.  
* 29 LlamaIndex Documentation. (2024, May 16). *GraphRAG V2 Cookbook (Summary of Provenance)*.  
* 25 LangChain Documentation. (n.d.). *Graph RAG Retriever (Summary of Provenance)*.  
* 36 W3C. (2014, June 24). *RDF 1.1 Primer (Summary of Multilingual Strings)*.  
* 126 TurkuNLP. (n.d.). *FinBERT GitHub Repository (Summary of Python examples availability)*.  
* 41 Helsinki-NLP. (n.d.). *Opus-MT GitHub Repository (Summary of Usage)*.  
* 127 TurkuNLP. (n.d.). *Finnish-dep-parser GitHub Repository (Summary of Tools and Omorfi)*.  
* 14 flammie. (n.d.). *Omorfi GitHub Repository (Summary of Python examples availability)*.  
* 115 TurkuNLP. (n.d.). *FinBERT Hugging Face Transformers Guide (Summary)*.

#### **Works cited**

1. jyx.jyu.fi, accessed May 14, 2025, [https://jyx.jyu.fi/bitstreams/87965817-c536-4120-8cab-c5c0b8f9e69f/download](https://jyx.jyu.fi/bitstreams/87965817-c536-4120-8cab-c5c0b8f9e69f/download)  
2. Constructing Knowledge Graphs From Unstructured Text Using LLMs, accessed May 14, 2025, [https://neo4j.com/blog/developer/construct-knowledge-graphs-unstructured-text/](https://neo4j.com/blog/developer/construct-knowledge-graphs-unstructured-text/)  
3. Finnish-dep-parser \- TurkuNLP, accessed May 14, 2025, [https://turkunlp.org/Finnish-dep-parser/](https://turkunlp.org/Finnish-dep-parser/)  
4. Turku neural parser pipeline \- TurkuNLP, accessed May 14, 2025, [http://turkunlp.org/Turku-neural-parser-pipeline/](http://turkunlp.org/Turku-neural-parser-pipeline/)  
5. Kansallisarkisto/finbert-ner \- Hugging Face, accessed May 14, 2025, [https://huggingface.co/Kansallisarkisto/finbert-ner](https://huggingface.co/Kansallisarkisto/finbert-ner)  
6. Relationship Extraction in NLP \- GeeksforGeeks, accessed May 14, 2025, [https://www.geeksforgeeks.org/relationship-extraction-in-nlp/](https://www.geeksforgeeks.org/relationship-extraction-in-nlp/)  
7. How to Build a Knowledge Graph: A Step-by-Step Guide \- FalkorDB, accessed May 14, 2025, [https://www.falkordb.com/blog/how-to-build-a-knowledge-graph/](https://www.falkordb.com/blog/how-to-build-a-knowledge-graph/)  
8. How to Build a Knowledge Graph in 7 Steps \- Neo4j, accessed May 14, 2025, [https://neo4j.com/blog/knowledge-graph/how-to-build-knowledge-graph/](https://neo4j.com/blog/knowledge-graph/how-to-build-knowledge-graph/)  
9. The GraphRAG Manifesto: Adding Knowledge to GenAI \- Neo4j, accessed May 14, 2025, [https://neo4j.com/blog/genai/graphrag-manifesto/](https://neo4j.com/blog/genai/graphrag-manifesto/)  
10. (PDF) Dictionary of disease ontologies (DODO): a graph database to facilitate access and interaction with disease and phenotype ontologies \- ResearchGate, accessed May 14, 2025, [https://www.researchgate.net/publication/343521904\_Dictionary\_of\_disease\_ontologies\_DODO\_a\_graph\_database\_to\_facilitate\_access\_and\_interaction\_with\_disease\_and\_phenotype\_ontologies](https://www.researchgate.net/publication/343521904_Dictionary_of_disease_ontologies_DODO_a_graph_database_to_facilitate_access_and_interaction_with_disease_and_phenotype_ontologies)  
11. Creating Knowledge Graphs from Unstructured Data \- Developer Guides \- Neo4j, accessed May 14, 2025, [https://neo4j.com/developer/genai-ecosystem/importing-graph-from-unstructured-data/](https://neo4j.com/developer/genai-ecosystem/importing-graph-from-unstructured-data/)  
12. FareedKhan-dev/big-data-with-KG: Handling Big Data with Knowledge Graph \- GitHub, accessed May 14, 2025, [https://github.com/FareedKhan-dev/big-data-with-KG](https://github.com/FareedKhan-dev/big-data-with-KG)  
13. FinnPos: an open-source morphological tagging and lemmatization toolkit for Finnish | Request PDF \- ResearchGate, accessed May 14, 2025, [https://www.researchgate.net/publication/287111723\_FinnPos\_an\_open-source\_morphological\_tagging\_and\_lemmatization\_toolkit\_for\_Finnish](https://www.researchgate.net/publication/287111723_FinnPos_an_open-source_morphological_tagging_and_lemmatization_toolkit_for_Finnish)  
14. flammie/omorfi: Open morphology for Finnish \- GitHub, accessed May 14, 2025, [https://github.com/flammie/omorfi](https://github.com/flammie/omorfi)  
15. TurkuNLP, accessed May 14, 2025, [https://turkunlp.org/finnish\_nlp.html](https://turkunlp.org/finnish_nlp.html)  
16. aclanthology.org, accessed May 14, 2025, [https://aclanthology.org/2023.emnlp-main.164.pdf](https://aclanthology.org/2023.emnlp-main.164.pdf)  
17. FinGPT: Large Generative Models for a Small Language \- OpenReview, accessed May 14, 2025, [https://openreview.net/forum?id=pHrNmdzX2C](https://openreview.net/forum?id=pHrNmdzX2C)  
18. Extracting Social Connections from Finnish Karelian Refugee Interviews Using LLMs \- arXiv, accessed May 14, 2025, [https://arxiv.org/html/2502.13566v1](https://arxiv.org/html/2502.13566v1)  
19. thunlp/OpenNRE: An Open-Source Package for Neural Relation Extraction (NRE) \- GitHub, accessed May 14, 2025, [https://github.com/thunlp/OpenNRE](https://github.com/thunlp/OpenNRE)  
20. Entity Extraction with spaCy \- Sematext, accessed May 14, 2025, [https://sematext.com/blog/entity-extraction-with-spacy/](https://sematext.com/blog/entity-extraction-with-spacy/)  
21. Relation Extraction with Llama3 Models \- Towards Data Science, accessed May 14, 2025, [https://towardsdatascience.com/relation-extraction-with-llama3-models-f8bc41858b9e/](https://towardsdatascience.com/relation-extraction-with-llama3-models-f8bc41858b9e/)  
22. Getting started with RDFLib — rdflib 7.1.0 documentation, accessed May 14, 2025, [https://rdflib.readthedocs.io/en/7.1.0/gettingstarted.html](https://rdflib.readthedocs.io/en/7.1.0/gettingstarted.html)  
23. Using a Knowledge Graph to Implement a RAG Application \- DataCamp, accessed May 14, 2025, [https://www.datacamp.com/tutorial/knowledge-graph-rag](https://www.datacamp.com/tutorial/knowledge-graph-rag)  
24. Implement GraphRAG with FalkorDB, LangChain & LangGraph, accessed May 14, 2025, [https://www.falkordb.com/blog/graphrag-workflow-falkordb-langchain/](https://www.falkordb.com/blog/graphrag-workflow-falkordb-langchain/)  
25. Graph RAG | 🦜️ LangChain, accessed May 14, 2025, [https://python.langchain.com/docs/integrations/retrievers/graph\_rag/](https://python.langchain.com/docs/integrations/retrievers/graph_rag/)  
26. Retrieval-Augmented Generation (RAG): Bridging LLMs with External Knowledge \- Walturn, accessed May 14, 2025, [https://www.walturn.com/insights/retrieval-augmented-generation-(rag)-bridging-llms-with-external-knowledge](https://www.walturn.com/insights/retrieval-augmented-generation-\(rag\)-bridging-llms-with-external-knowledge)  
27. RAG vs. GraphRAG: A Systematic Evaluation and Key Insights \- arXiv, accessed May 14, 2025, [https://arxiv.org/html/2502.11371v1](https://arxiv.org/html/2502.11371v1)  
28. How to build single-agent RAG system with LlamaIndex? \- Memgraph, accessed May 14, 2025, [https://memgraph.com/blog/single-agent-rag-system](https://memgraph.com/blog/single-agent-rag-system)  
29. GraphRAG Implementation with LlamaIndex \- V2 \- LlamaIndex, accessed May 14, 2025, [https://docs.llamaindex.ai/en/stable/examples/cookbooks/GraphRAG\_v2/](https://docs.llamaindex.ai/en/stable/examples/cookbooks/GraphRAG_v2/)  
30. Metadata Extraction \- LlamaIndex, accessed May 14, 2025, [https://docs.llamaindex.ai/en/stable/examples/cookbooks/oreilly\_course\_cookbooks/Module-4/Metadata\_Extraction/](https://docs.llamaindex.ai/en/stable/examples/cookbooks/oreilly_course_cookbooks/Module-4/Metadata_Extraction/)  
31. Glossary | Maahanmuuttovirasto, accessed May 14, 2025, [https://www.migri.fi/en/glossary](https://www.migri.fi/en/glossary)  
32. Suomi.fi-Finnish Service Catalogue \- Interoperable Europe Portal, accessed May 14, 2025, [https://interoperable-europe.ec.europa.eu/sites/default/files/inline-files/Suomifi\_Finnish\_Service\_Catalogue\_Finland.pdf](https://interoperable-europe.ec.europa.eu/sites/default/files/inline-files/Suomifi_Finnish_Service_Catalogue_Finland.pdf)  
33. PTV Open Api Documentation \- PROD \- Suomi.fi, accessed May 14, 2025, [https://api.palvelutietovaranto.suomi.fi/swagger/ui/index.html](https://api.palvelutietovaranto.suomi.fi/swagger/ui/index.html)  
34. Knowledge graphs to enhance and achieve your AI and machine ..., accessed May 14, 2025, [https://www.ontoforce.com/blog/best-practices-knowledge-graphs-enhance-achieve-ai-machine-learning](https://www.ontoforce.com/blog/best-practices-knowledge-graphs-enhance-achieve-ai-machine-learning)  
35. RDF terms in rdflib — rdflib 7.1.1 documentation, accessed May 14, 2025, [https://rdflib.readthedocs.io/en/7.1.1/rdf\_terms.html](https://rdflib.readthedocs.io/en/7.1.1/rdf_terms.html)  
36. RDF 1.1 Primer \- W3C, accessed May 14, 2025, [https://www.w3.org/TR/rdf11-primer/](https://www.w3.org/TR/rdf11-primer/)  
37. Enhancing Large Language Models with Knowledge Graphs \- DataCamp, accessed May 14, 2025, [https://www.datacamp.com/blog/knowledge-graphs-and-llms](https://www.datacamp.com/blog/knowledge-graphs-and-llms)  
38. Research and publications | Natural Language Understanding | University of Helsinki, accessed May 14, 2025, [https://www.helsinki.fi/en/researchgroups/natural-language-understanding/research-and-publications](https://www.helsinki.fi/en/researchgroups/natural-language-understanding/research-and-publications)  
39. OpusDistillery: A Configurable End-to-End Pipeline for Systematic Multilingual Distillation of Open NMT Models \- ACL Anthology, accessed May 14, 2025, [https://aclanthology.org/2025.nodalida-1.20.pdf](https://aclanthology.org/2025.nodalida-1.20.pdf)  
40. Helsinki-NLP/opus-mt-tc-big-en-es \- Toolify.ai, accessed May 14, 2025, [https://www.toolify.ai/ai-model/helsinki-nlp-opus-mt-tc-big-en-es](https://www.toolify.ai/ai-model/helsinki-nlp-opus-mt-tc-big-en-es)  
41. Helsinki-NLP/Opus-MT: Open neural machine translation ... \- GitHub, accessed May 14, 2025, [https://github.com/Helsinki-NLP/Opus-MT](https://github.com/Helsinki-NLP/Opus-MT)  
42. Multilingual Knowledge Graph \- Coreon, accessed May 14, 2025, [https://coreon.com/product/multilingual-knowledge-graph/](https://coreon.com/product/multilingual-knowledge-graph/)  
43. Introduction to Graph RAG \- Aerospike, accessed May 14, 2025, [https://aerospike.com/blog/introduction-to-graph-rag/](https://aerospike.com/blog/introduction-to-graph-rag/)  
44. Unlocking Smarter AI with GraphRAG: Better Answers with Knowledge Graph-Enhanced Retrieval \- Mosaic Data Science, accessed May 14, 2025, [https://mosaicdatascience.com/2024/09/04/unlocking-smarter-ai-with-graphrag/](https://mosaicdatascience.com/2024/09/04/unlocking-smarter-ai-with-graphrag/)  
45. Hybrid Retrieval with Graph Traversal \- GraphAcademy \- Neo4j, accessed May 14, 2025, [https://graphacademy.neo4j.com/courses/genai-workshop-graphrag/2-neo4j-graphrag/5-hybrid-cypher-retriever/](https://graphacademy.neo4j.com/courses/genai-workshop-graphrag/2-neo4j-graphrag/5-hybrid-cypher-retriever/)  
46. Enhancing Hybrid Retrieval With Graph Traversal: Neo4j GraphRAG ..., accessed May 14, 2025, [https://neo4j.com/blog/developer/enhancing-hybrid-retrieval-graphrag-python-package/](https://neo4j.com/blog/developer/enhancing-hybrid-retrieval-graphrag-python-package/)  
47. Turku Neural Parser Pipeline: An End-to-End System for the CoNLL 2018 Shared Task \- ACL Anthology, accessed May 14, 2025, [https://aclanthology.org/K18-2013.pdf](https://aclanthology.org/K18-2013.pdf)  
48. Finnish NER \- TurkuNLP, accessed May 14, 2025, [https://turkunlp.org/fin-ner.html](https://turkunlp.org/fin-ner.html)  
49. HFST — A System for Creating NLP Tools \- SciSpace, accessed May 14, 2025, [https://scispace.com/pdf/hfst-a-system-for-creating-nlp-tools-1k4c0tk01x.pdf](https://scispace.com/pdf/hfst-a-system-for-creating-nlp-tools-1k4c0tk01x.pdf)  
50. (PDF) HFST \- A System for Creating NLP Tools \- ResearchGate, accessed May 14, 2025, [https://www.researchgate.net/publication/289711191\_HFST\_-\_A\_System\_for\_Creating\_NLP\_Tools](https://www.researchgate.net/publication/289711191_HFST_-_A_System_for_Creating_NLP_Tools)  
51. Omorfi language binding APIs \- Flammie \- GitHub Pages, accessed May 14, 2025, [http://flammie.github.io/omorfi/API-design.html](http://flammie.github.io/omorfi/API-design.html)  
52. Compounding in Finnish \- Morphology 440 640 \- WordPress.com, accessed May 14, 2025, [https://lisatravis2012.wordpress.com/2017/10/19/compounding-in-finnish-2/](https://lisatravis2012.wordpress.com/2017/10/19/compounding-in-finnish-2/)  
53. Dealing with a small amount of data – developing Finnish sentiment analysis \- JYX, accessed May 14, 2025, [https://jyx.jyu.fi/bitstreams/798da3c9-b011-4106-9f8e-d1068c3042a8/download](https://jyx.jyu.fi/bitstreams/798da3c9-b011-4106-9f8e-d1068c3042a8/download)  
54. Cross-sentence contexts in Named Entity Recognition with BERT \- UTUPub, accessed May 14, 2025, [https://www.utupub.fi/bitstream/10024/152334/1/Luoma\_Jouni\_opinnayte.pdf](https://www.utupub.fi/bitstream/10024/152334/1/Luoma_Jouni_opinnayte.pdf)  
55. Text\_Mining\_Course/Elementary text processing.ipynb at master · TurkuNLP ... \- GitHub, accessed May 14, 2025, [https://github.com/TurkuNLP/Text\_Mining\_Course/blob/master/Elementary%20text%20processing.ipynb](https://github.com/TurkuNLP/Text_Mining_Course/blob/master/Elementary%20text%20processing.ipynb)  
56. Relation Extraction | Papers With Code, accessed May 14, 2025, [https://paperswithcode.com/task/relation-extraction](https://paperswithcode.com/task/relation-extraction)  
57. GPT-FinRE: In-context Learning for Financial Relation Extraction using Large Language Models \- arXiv, accessed May 14, 2025, [https://arxiv.org/pdf/2306.17519](https://arxiv.org/pdf/2306.17519)  
58. How to Build a Knowledge Graph for Beginners\[+Step & Tips\] \- PageOn.ai, accessed May 14, 2025, [https://www.pageon.ai/blog/how-to-build-a-knowledge-graph](https://www.pageon.ai/blog/how-to-build-a-knowledge-graph)  
59. What is SPARQL and how is it used with knowledge graphs? \- Milvus, accessed May 14, 2025, [https://milvus.io/ai-quick-reference/what-is-sparql-and-how-is-it-used-with-knowledge-graphs](https://milvus.io/ai-quick-reference/what-is-sparql-and-how-is-it-used-with-knowledge-graphs)  
60. Hands-On 3.2 Querying Knowledge Graphs with SPARQL \- DBpedia \- YouTube, accessed May 14, 2025, [https://www.youtube.com/watch?v=q4aKo7wKhqw](https://www.youtube.com/watch?v=q4aKo7wKhqw)  
61. Building, Improving, and Deploying Knowledge Graph RAG Systems on Databricks, accessed May 14, 2025, [https://www.databricks.com/blog/building-improving-and-deploying-knowledge-graph-rag-systems-databricks](https://www.databricks.com/blog/building-improving-and-deploying-knowledge-graph-rag-systems-databricks)  
62. Basic queries \- Cypher Manual \- Neo4j, accessed May 14, 2025, [https://neo4j.com/docs/cypher-manual/current/queries/basic/](https://neo4j.com/docs/cypher-manual/current/queries/basic/)  
63. Knowledge Graph Tutorial: A Step-by-Step Guide for Beginners \- SmythOS, accessed May 14, 2025, [https://smythos.com/ai-agents/ai-tutorials/knowledge-graph-tutorial/](https://smythos.com/ai-agents/ai-tutorials/knowledge-graph-tutorial/)  
64. Greval: an evaluation tool for Lettria's GraphRAG \- Lettria, accessed May 14, 2025, [https://www.lettria.com/lettria-lab/greval-an-evaluation-tool-for-lettrias-graphrag](https://www.lettria.com/lettria-lab/greval-an-evaluation-tool-for-lettrias-graphrag)  
65. GraphRAG: Origin, Uses, Implementation and More \- Chitika, accessed May 14, 2025, [https://www.chitika.com/graphrag-origin-uses-implementation/](https://www.chitika.com/graphrag-origin-uses-implementation/)  
66. Knowledge Graph Tools: The Ultimate Guide \- PuppyGraph, accessed May 14, 2025, [https://www.puppygraph.com/blog/knowledge-graph-tools](https://www.puppygraph.com/blog/knowledge-graph-tools)  
67. Javascript Graph Visualization | Tom Sawyer Software, accessed May 14, 2025, [https://blog.tomsawyer.com/javascript-graph-visualization](https://blog.tomsawyer.com/javascript-graph-visualization)  
68. Visualizing Knowledge Graphs: A Guide to Complex Topics \- Instructor, accessed May 14, 2025, [https://python.useinstructor.com/examples/knowledge\_graph/](https://python.useinstructor.com/examples/knowledge_graph/)  
69. Gephi \- The Open Graph Viz Platform, accessed May 14, 2025, [https://gephi.org/](https://gephi.org/)  
70. RAWGraphs, accessed May 14, 2025, [https://www.rawgraphs.io/](https://www.rawgraphs.io/)  
71. Semantic Digital Libraries in Public Administration: A Knowledge Graph Approach to Certificate Request Management \- CEUR-WS.org, accessed May 14, 2025, [https://ceur-ws.org/Vol-3937/paper11.pdf](https://ceur-ws.org/Vol-3937/paper11.pdf)  
72. How to Build a Knowledge Graph for AI Applications – Hypermode, accessed May 14, 2025, [https://hypermode.com/blog/build-knowledge-graph-ai-applications](https://hypermode.com/blog/build-knowledge-graph-ai-applications)  
73. Generate Knowledge Graphs for Complex Interactions \- The Prompt Engineering Institute, accessed May 14, 2025, [https://promptengineering.org/knowledge-graphs-in-ai-conversational-models/](https://promptengineering.org/knowledge-graphs-in-ai-conversational-models/)  
74. Leveraging Knowledge Graphs and LLMs for Context-Aware Messaging \- arXiv, accessed May 14, 2025, [https://arxiv.org/html/2503.13499v1](https://arxiv.org/html/2503.13499v1)  
75. Intro to AI Agents \- ResearchGate, accessed May 14, 2025, [https://www.researchgate.net/post/Intro\_to\_AI\_Agents](https://www.researchgate.net/post/Intro_to_AI_Agents)  
76. AdaptBot: Combining LLM with Knowledge Graphs and Human Input for Generic-to-Specific Task Decomposition and Knowledge Refinement \- arXiv, accessed May 14, 2025, [https://arxiv.org/html/2502.02067v1](https://arxiv.org/html/2502.02067v1)  
77. How to build a knowledge graph in 9 simple steps \- Lettria, accessed May 14, 2025, [https://www.lettria.com/blogpost/how-to-build-a-knowledge-graph-in-9-simple-steps](https://www.lettria.com/blogpost/how-to-build-a-knowledge-graph-in-9-simple-steps)  
78. A dynamically updatable knowledge graph construction method for computer-aided process planning and design \- ResearchGate, accessed May 14, 2025, [https://www.researchgate.net/publication/389196373\_A\_dynamically\_updatable\_knowledge\_graph\_construction\_method\_for\_computer-aided\_process\_planning\_and\_design](https://www.researchgate.net/publication/389196373_A_dynamically_updatable_knowledge_graph_construction_method_for_computer-aided_process_planning_and_design)  
79. Towards Explainable Automated Knowledge Engineering with Human-in-the-loop \- Semantic Web Journal, accessed May 14, 2025, [https://www.semantic-web-journal.net/system/files/swj3814.pdf](https://www.semantic-web-journal.net/system/files/swj3814.pdf)  
80. Extracting Geographical References from Finnish Literature. Fully Automated Processing of Plain-Text Corpora, accessed May 14, 2025, [https://jcls.io/article/id/3584/](https://jcls.io/article/id/3584/)  
81. TurkuNLP, accessed May 14, 2025, [https://turkunlp.org/](https://turkunlp.org/)  
82. Language Technology at the University of Helsinki · GitHub, accessed May 14, 2025, [https://github.com/Helsinki-NLP](https://github.com/Helsinki-NLP)  
83. Bilingual Tests with Swedish, Finnish, and German Queries \- SciSpace, accessed May 14, 2025, [https://scispace.com/pdf/bilingual-tests-with-swedish-finnish-and-german-queries-qbyfr4l7pf.pdf](https://scispace.com/pdf/bilingual-tests-with-swedish-finnish-and-german-queries-qbyfr4l7pf.pdf)  
84. Legal Resources for Immigrants, Advocates, Journalists, and Lawmakers | Vera Institute, accessed May 14, 2025, [https://www.vera.org/explainers/legal-resources-for-immigrants-advocates-journalists-and-lawmakers](https://www.vera.org/explainers/legal-resources-for-immigrants-advocates-journalists-and-lawmakers)  
85. (PDF) Ontologies in the Legal Domain \- ResearchGate, accessed May 14, 2025, [https://www.researchgate.net/publication/226270544\_Ontologies\_in\_the\_Legal\_Domain](https://www.researchgate.net/publication/226270544_Ontologies_in_the_Legal_Domain)  
86. Multilingual Knowledge Graph Construction · Issue \#296 · HKUDS/LightRAG \- GitHub, accessed May 14, 2025, [https://github.com/HKUDS/LightRAG/issues/296](https://github.com/HKUDS/LightRAG/issues/296)  
87. Graph RAG Architecture: Building Efficient Information Retrieval Systems Without LLMs, accessed May 14, 2025, [https://ragaboutit.com/graph-rag-architecture-building-efficient-information-retrieval-systems-without-llms/](https://ragaboutit.com/graph-rag-architecture-building-efficient-information-retrieval-systems-without-llms/)  
88. LASTU: A psycholinguistic search tool for Finnish lexical stimuli \- PMC \- PubMed Central, accessed May 14, 2025, [https://pmc.ncbi.nlm.nih.gov/articles/PMC11335774/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11335774/)  
89. Development of an Open Source Natural Language Generation Tool for Finnish, accessed May 14, 2025, [https://www.researchgate.net/publication/325445578\_Development\_of\_an\_Open\_Source\_Natural\_Language\_Generation\_Tool\_for\_Finnish](https://www.researchgate.net/publication/325445578_Development_of_an_Open_Source_Natural_Language_Generation_Tool_for_Finnish)  
90. The fiscal impact of immigration in OECD countries \- Semantic Scholar, accessed May 14, 2025, [https://www.semanticscholar.org/paper/The-fiscal-impact-of-immigration-in-OECD-countries/d63a263563d84ba04d45b2736a64f28b14ccf48a](https://www.semanticscholar.org/paper/The-fiscal-impact-of-immigration-in-OECD-countries/d63a263563d84ba04d45b2736a64f28b14ccf48a)  
91. The Finnish Model \- City Journal, accessed May 14, 2025, [https://www.city-journal.org/article/the-finnish-model](https://www.city-journal.org/article/the-finnish-model)  
92. Training a relation extraction component \- solved \- Prodigy Support, accessed May 14, 2025, [https://support.prodi.gy/t/training-a-relation-extraction-component/6376](https://support.prodi.gy/t/training-a-relation-extraction-component/6376)  
93. NER\_introduction.ipynb \- TurkuNLP/Text\_Mining\_Course \- GitHub, accessed May 14, 2025, [https://github.com/TurkuNLP/Text\_Mining\_Course/blob/master/NER\_introduction.ipynb](https://github.com/TurkuNLP/Text_Mining_Course/blob/master/NER_introduction.ipynb)  
94. Network Graphs and the Semantic Web with Python \- YouTube, accessed May 14, 2025, [https://www.youtube.com/watch?v=eEJYCaug5Zo](https://www.youtube.com/watch?v=eEJYCaug5Zo)  
95. Knowledge Graph Creation with NetworkX | Python Tutorial \- YouTube, accessed May 14, 2025, [https://www.youtube.com/watch?v=o5USzpzKm6o](https://www.youtube.com/watch?v=o5USzpzKm6o)  
96. JatinnG/NLP\_Compound\_Word\_Splitter: In this project, we will build a heuristic compound word splitter that can help in word sense disambiguation for a wide array of NLP applications. \- GitHub, accessed May 14, 2025, [https://github.com/JatinnG/NLP\_Compound\_Word\_Splitter](https://github.com/JatinnG/NLP_Compound_Word_Splitter)  
97. Dialect Text Normalization to Normative Standard Finnish \- ResearchGate, accessed May 14, 2025, [https://www.researchgate.net/publication/337000016\_Dialect\_Text\_Normalization\_to\_Normative\_Standard\_Finnish](https://www.researchgate.net/publication/337000016_Dialect_Text_Normalization_to_Normative_Standard_Finnish)  
98. Text Normalisation of Dialectal Finnish \- Helda \- University of Helsinki, accessed May 14, 2025, [https://helda.helsinki.fi/bitstreams/f82f4858-1541-43d3-a7c4-bddc23190d28/download](https://helda.helsinki.fi/bitstreams/f82f4858-1541-43d3-a7c4-bddc23190d28/download)  
99. Suomi.fi Quality Tools \- Observatory of Public Sector Innovation, accessed May 14, 2025, [https://oecd-opsi.org/innovations/suomi-fi-quality-tools/](https://oecd-opsi.org/innovations/suomi-fi-quality-tools/)  
100. Traditional RAG to Graph RAG: The Evolution of Retrieval Systems \- Analytics Vidhya, accessed May 14, 2025, [https://www.analyticsvidhya.com/blog/2025/03/traditional-rag-vs-graph-rag/](https://www.analyticsvidhya.com/blog/2025/03/traditional-rag-vs-graph-rag/)  
101. Biclustering high-frequency MeSH terms based on the co-occurrence of distinct semantic types in a MeSH tree \- ResearchGate, accessed May 14, 2025, [https://www.researchgate.net/publication/341889639\_Biclustering\_high-frequency\_MeSH\_terms\_based\_on\_the\_co-occurrence\_of\_distinct\_semantic\_types\_in\_a\_MeSH\_tree](https://www.researchgate.net/publication/341889639_Biclustering_high-frequency_MeSH_terms_based_on_the_co-occurrence_of_distinct_semantic_types_in_a_MeSH_tree)  
102. (PDF) Semantic data driven approach for merchandizing optimization \- ResearchGate, accessed May 14, 2025, [https://www.researchgate.net/publication/357149254\_Semantic\_data\_driven\_approach\_for\_merchandizing\_optimization](https://www.researchgate.net/publication/357149254_Semantic_data_driven_approach_for_merchandizing_optimization)  
103. Semantic data driven approach for merchandizing optimization \- Eurecom, accessed May 14, 2025, [https://www.eurecom.fr/publication/6636/download/data-publi-6636.pdf](https://www.eurecom.fr/publication/6636/download/data-publi-6636.pdf)  
104. TurkuNLP/Turku-neural-parser-pipeline \- GitHub, accessed May 14, 2025, [https://github.com/TurkuNLP/Turku-neural-parser-pipeline](https://github.com/TurkuNLP/Turku-neural-parser-pipeline)  
105. NER4all or Context is All You Need \- arXiv, accessed May 14, 2025, [https://arxiv.org/html/2502.04351v1](https://arxiv.org/html/2502.04351v1)  
106. FSC – Uniform service descriptions \- Suomi.fi for Service Developers, accessed May 14, 2025, [https://kehittajille.suomi.fi/services/servicecatalogue](https://kehittajille.suomi.fi/services/servicecatalogue)  
107. An easy solution to importing data from PTV \- Synergia Foxy, accessed May 14, 2025, [https://www.synergiafoxy.com/features/en-ptv/](https://www.synergiafoxy.com/features/en-ptv/)  
108. How To Use Text Normalization Techniques In NLP With Python \[9 Ways\] \- Spot Intelligence, accessed May 14, 2025, [https://spotintelligence.com/2023/01/25/text-normalization-techniques-nlp/](https://spotintelligence.com/2023/01/25/text-normalization-techniques-nlp/)  
109. Normalisation example walk through \- YouTube, accessed May 14, 2025, [https://www.youtube.com/watch?v=yYioLVWgh64](https://www.youtube.com/watch?v=yYioLVWgh64)  
110. Generating Healthcare Reports Using Natural Language Processing \- Trepo, accessed May 14, 2025, [https://trepo.tuni.fi/bitstream/10024/224856/2/LaitinenTuuli.pdf](https://trepo.tuni.fi/bitstream/10024/224856/2/LaitinenTuuli.pdf)  
111. Overview of development and challenges of attitude determination for rotary wing UAVs based on GNSS \- Frontiers, accessed May 14, 2025, [https://www.frontiersin.org/journals/physics/articles/10.3389/fphy.2025.1487136/full](https://www.frontiersin.org/journals/physics/articles/10.3389/fphy.2025.1487136/full)  
112. United States Customs and Border Protection – AI Use Cases | Homeland Security, accessed May 14, 2025, [https://www.dhs.gov/ai/use-case-inventory/cbp](https://www.dhs.gov/ai/use-case-inventory/cbp)  
113. (PDF) Beyond Conversational Artificial Intelligence \- ResearchGate, accessed May 14, 2025, [https://www.researchgate.net/publication/347160497\_Beyond\_Conversational\_Artificial\_Intelligence](https://www.researchgate.net/publication/347160497_Beyond_Conversational_Artificial_Intelligence)  
114. WIMMICS \- 2024 \- Annual activity report, accessed May 14, 2025, [https://radar.inria.fr/report/2024/wimmics](https://radar.inria.fr/report/2024/wimmics)  
115. huggingface\_transformers.md \- TurkuNLP/FinBERT \- GitHub, accessed May 14, 2025, [https://github.com/TurkuNLP/FinBERT/blob/master/huggingface\_transformers.md](https://github.com/TurkuNLP/FinBERT/blob/master/huggingface_transformers.md)  
116. TurkuNLP/sbert-cased-finnish-paraphrase \- Hugging Face, accessed May 14, 2025, [https://huggingface.co/TurkuNLP/sbert-cased-finnish-paraphrase](https://huggingface.co/TurkuNLP/sbert-cased-finnish-paraphrase)  
117. A survey of multilingual large language models \- PMC \- PubMed Central, accessed May 14, 2025, [https://pmc.ncbi.nlm.nih.gov/articles/PMC11783891/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11783891/)  
118. PTV Open Api Documentation \- TRN \- Suomi.fi, accessed May 14, 2025, [https://api.palvelutietovaranto.trn.suomi.fi/swagger/ui/index.html](https://api.palvelutietovaranto.trn.suomi.fi/swagger/ui/index.html)  
119. Exploring Knowledge Graph \- ServiceNow, accessed May 14, 2025, [https://www.servicenow.com/docs/bundle/yokohama-intelligent-experiences/page/administer/knowledge-graph/concept/exploring-knowledge-graph.html](https://www.servicenow.com/docs/bundle/yokohama-intelligent-experiences/page/administer/knowledge-graph/concept/exploring-knowledge-graph.html)  
120. Current Trends in Natural Language Processing (NLP) and Human Language Technology (HLT) \- MDPI, accessed May 14, 2025, [https://mdpi-res.com/bookfiles/book/8881/Current\_Trends\_in\_Natural\_Language\_Processing\_NLP\_and\_Human\_Language\_Technology\_HLT.pdf?v=1743469680](https://mdpi-res.com/bookfiles/book/8881/Current_Trends_in_Natural_Language_Processing_NLP_and_Human_Language_Technology_HLT.pdf?v=1743469680)  
121. A Comparative Analysis of Instruction Fine-Tuning LLMs for Financial Text Classification, accessed May 14, 2025, [https://arxiv.org/html/2411.02476v1](https://arxiv.org/html/2411.02476v1)  
122. What is text, really? TEI and beyond \- Text Encoding Initiative, accessed May 14, 2025, [https://tei-c.org/Vault/MembersMeetings/2019/files/BoATEI2019.pdf](https://tei-c.org/Vault/MembersMeetings/2019/files/BoATEI2019.pdf)  
123. 123622 PDFs | Review articles in RELATIONAL DATABASES \- ResearchGate, accessed May 14, 2025, [https://www.researchgate.net/topic/Relational-Databases/publications/5](https://www.researchgate.net/topic/Relational-Databases/publications/5)  
124. Enhancing Scientific Reproducibility Through Automated BioCompute Object Creation Using Retrieval-Augmented Generation from Publications \- ResearchGate, accessed May 14, 2025, [https://www.researchgate.net/publication/384288475\_Enhancing\_Scientific\_Reproducibility\_Through\_Automated\_BioCompute\_Object\_Creation\_Using\_Retrieval-Augmented\_Generation\_from\_Publications](https://www.researchgate.net/publication/384288475_Enhancing_Scientific_Reproducibility_Through_Automated_BioCompute_Object_Creation_Using_Retrieval-Augmented_Generation_from_Publications)  
125. hfst/ChangeLog at master · hfst/hfst \- GitHub, accessed May 14, 2025, [https://github.com/hfst/hfst/blob/master/ChangeLog](https://github.com/hfst/hfst/blob/master/ChangeLog)  
126. TurkuNLP/FinBERT: BERT model trained from scratch on ... \- GitHub, accessed May 14, 2025, [https://github.com/TurkuNLP/FinBERT](https://github.com/TurkuNLP/FinBERT)  
127. TurkuNLP/Finnish-dep-parser: The Finnish dependency ... \- GitHub, accessed May 14, 2025, [https://github.com/TurkuNLP/Finnish-dep-parser](https://github.com/TurkuNLP/Finnish-dep-parser)