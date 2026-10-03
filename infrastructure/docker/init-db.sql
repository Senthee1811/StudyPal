-- StudyPal per-service database initialization script
-- Executed on first startup of the PostgreSQL container

SELECT 'CREATE DATABASE studypal_identity'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'studypal_identity')\gexec

SELECT 'CREATE DATABASE studypal_content'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'studypal_content')\gexec

SELECT 'CREATE DATABASE studypal_document'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'studypal_document')\gexec

SELECT 'CREATE DATABASE studypal_knowledge'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'studypal_knowledge')\gexec

SELECT 'CREATE DATABASE studypal_assessment'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'studypal_assessment')\gexec

SELECT 'CREATE DATABASE studypal_progress'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'studypal_progress')\gexec

SELECT 'CREATE DATABASE studypal_tutor'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'studypal_tutor')\gexec

SELECT 'CREATE DATABASE studypal_ai'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'studypal_ai')\gexec

-- Enable pgvector in studypal_knowledge
\c studypal_knowledge
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
