# AWS Serverless Content Moderation Workshop

*Workshop for ExpoASI - National Academic Exhibition of Information Systems Administration organized by @UNManizales*

🌐 **English** | [Español](#español)

---

## English

### Overview

This project demonstrates how to build a **serverless content moderation system** using AWS services. It's designed as a hands-on workshop for ExpoASI at the National University of Colombia, showcasing modern cloud architecture patterns and AI-powered content analysis.

### Architecture

The application follows a **serverless architecture** with two main components:

#### 🚀 Backend (AWS Lambda + API Gateway + Rekognition)
- **AWS Lambda**: Python function that processes image moderation requests
- **Amazon API Gateway**: RESTful API endpoint with CORS support
- **Amazon Rekognition**: AI service for content moderation and inappropriate content detection

#### 🎨 Frontend (Next.js Static Site)
- **Next.js 16**: Modern React framework with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **Static Deployment**: Optimized for CDN distribution

### Features

- ✅ **Real-time Image Analysis**: Upload images and get instant moderation results
- ✅ **AI-Powered Detection**: Uses Amazon Rekognition to detect inappropriate content
- ✅ **Confidence Scoring**: Configurable confidence threshold (90% by default)
- ✅ **CORS Support**: Cross-origin resource sharing for web applications
- ✅ **Error Handling**: Comprehensive error management and logging

### Technologies Used

**Backend:**
- Python 3.x
- AWS Lambda
- Amazon API Gateway
- Amazon Rekognition
- Boto3 (AWS SDK)

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components

### Getting Started

#### Prerequisites
- AWS Account with appropriate permissions
- Node.js 18+ and npm/pnpm
- Python 3.x
- AWS CLI configured

#### Backend Setup
1. Deploy the Lambda function with the provided `handler.py`
2. Configure API Gateway with CORS settings
3. Set up IAM roles for Rekognition access
4. Update the minimum confidence threshold as needed

#### Frontend Setup
```bash
cd code
npm install
# or
pnpm install

# Development
npm run dev

# Production build
npm run build
```

### Deployment

- **Backend**: Deploy to AWS Lambda with API Gateway integration
- **Frontend**: Build and deploy as a static site (Vercel, Netlify, S3 + CloudFront)

### Workshop Information

This project is part of a workshop presented at **ExpoASI** - National Academic Exhibition of Information Systems Administration organized by @UNManizales (Universidad Nacional de Colombia - Sede Manizales).

📘 **Social Media:**
- Facebook: [ExpoASI](https://web.facebook.com/ExpoASI)
- Instagram: [@expoasi](https://www.instagram.com/expoasi/)

### Learning Objectives

- Understand serverless architecture patterns
- Learn AWS Lambda and API Gateway integration
- Explore AI services with Amazon Rekognition
- Practice modern frontend development with Next.js
- Implement CORS and error handling
- Deploy full-stack applications to the cloud

---

## Español

### Descripción General

Este proyecto demuestra cómo construir un **sistema de moderación de contenido serverless** usando servicios de AWS. Está diseñado como un taller práctico para ExpoASI de la Universidad Nacional de Colombia, mostrando patrones modernos de arquitectura en la nube y análisis de contenido con IA.

### Arquitectura

La aplicación sigue una **arquitectura serverless** con dos componentes principales:

#### 🚀 Backend (AWS Lambda + API Gateway + Rekognition)
- **AWS Lambda**: Función Python que procesa solicitudes de moderación de imágenes
- **Amazon API Gateway**: Endpoint de API RESTful con soporte CORS
- **Amazon Rekognition**: Servicio de IA para moderación de contenido y detección de contenido inapropiado

#### 🎨 Frontend (Sitio Estático Next.js)
- **Next.js 16**: Framework moderno de React con TypeScript
- **Tailwind CSS**: Framework CSS utility-first
- **Radix UI**: Biblioteca de componentes accesibles
- **Despliegue Estático**: Optimizado para distribución CDN

### Características

- ✅ **Análisis de Imágenes en Tiempo Real**: Sube imágenes y obtén resultados de moderación instantáneos
- ✅ **Detección con IA**: Usa Amazon Rekognition para detectar contenido inapropiado
- ✅ **Puntuación de Confianza**: Umbral de confianza configurable (90% por defecto)
- ✅ **Soporte CORS**: Intercambio de recursos de origen cruzado para aplicaciones web
- ✅ **Manejo de Errores**: Gestión integral de errores y registro

### Tecnologías Utilizadas

**Backend:**
- Python 3.x
- AWS Lambda
- Amazon API Gateway
- Amazon Rekognition
- Boto3 (AWS SDK)

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Componentes Radix UI

### Comenzando

#### Prerequisitos
- Cuenta de AWS con permisos apropiados
- Node.js 18+ y npm/pnpm
- Python 3.x
- AWS CLI configurado

#### Configuración del Backend
1. Despliega la función Lambda con el `handler.py` proporcionado
2. Configura API Gateway con configuraciones CORS
3. Configura roles IAM para acceso a Rekognition
4. Actualiza el umbral de confianza mínimo según sea necesario

#### Configuración del Frontend
```bash
cd code
npm install
# o
pnpm install

# Desarrollo
npm run dev

# Build de producción
npm run build
```

### Despliegue

- **Backend**: Despliega en AWS Lambda con integración de API Gateway
- **Frontend**: Construye y despliega como sitio estático (Vercel, Netlify, S3 + CloudFront)

### Información del Taller

Este proyecto es parte de un taller presentado en **ExpoASI** - Muestra Académica Nacional de Administración de Sistemas Informáticos organizada por @UNManizales (Universidad Nacional de Colombia - Sede Manizales).

📘 **Redes Sociales:**
- Facebook: [ExpoASI](https://web.facebook.com/ExpoASI)
- Instagram: [@expoasi](https://www.instagram.com/expoasi/)

### Objetivos de Aprendizaje

- Entender patrones de arquitectura serverless
- Aprender integración de AWS Lambda y API Gateway
- Explorar servicios de IA con Amazon Rekognition
- Practicar desarrollo frontend moderno con Next.js
- Implementar CORS y manejo de errores
- Desplegar aplicaciones full-stack en la nube

---