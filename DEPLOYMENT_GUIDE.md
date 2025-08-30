# Voice Shopping Assistant - Deployment Guide

## Overview

This guide covers deploying the Voice Shopping Assistant to various environments, from local development to production.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)
- Git

## Environment Variables

Create a `.env` file in the root directory:

```bash
# API Keys
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=production

# Database (for future enhancements)
DATABASE_URL=mongodb://localhost:27017/shopping-assistant

# Security
JWT_SECRET=your_jwt_secret_here
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
# Start frontend development server
npm run dev

# Start backend server (in another terminal)
npm start
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Docker Deployment

### 1. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### 2. Individual Docker Commands

```bash
# Build frontend image
docker build -t voice-shopping-frontend .

# Build backend image
docker build -f Dockerfile.backend -t voice-shopping-backend .

# Run containers
docker run -p 80:80 voice-shopping-frontend
docker run -p 3001:3001 voice-shopping-backend
```

## Cloud Deployment

### AWS Deployment

#### 1. AWS ECS (Elastic Container Service)

```bash
# Create ECR repository
aws ecr create-repository --repository-name voice-shopping-assistant

# Build and push image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
docker tag voice-shopping-frontend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/voice-shopping-assistant:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/voice-shopping-assistant:latest
```

#### 2. AWS S3 + CloudFront (Static Hosting)

```bash
# Build the application
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Google Cloud Platform

#### 1. Google Cloud Run

```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/voice-shopping-assistant
gcloud run deploy voice-shopping-assistant --image gcr.io/YOUR_PROJECT_ID/voice-shopping-assistant --platform managed
```

#### 2. Google App Engine

Create `app.yaml`:

```yaml
runtime: nodejs18
service: voice-shopping-assistant

env_variables:
  NODE_ENV: production
  GEMINI_API_KEY: your_api_key

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10
```

Deploy:
```bash
gcloud app deploy
```

### Azure Deployment

#### 1. Azure Container Instances

```bash
# Build and push to Azure Container Registry
az acr build --registry your-registry --image voice-shopping-assistant .

# Deploy to Container Instances
az container create \
  --resource-group your-rg \
  --name voice-shopping-assistant \
  --image your-registry.azurecr.io/voice-shopping-assistant:latest \
  --ports 80
```

#### 2. Azure App Service

```bash
# Deploy to App Service
az webapp up --name voice-shopping-assistant --resource-group your-rg --runtime "NODE|18-lts"
```

## Vercel Deployment

### 1. Connect Repository

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 2. Environment Variables

Add in Vercel dashboard:
- `VITE_GEMINI_API_KEY`
- `NODE_ENV=production`

### 3. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Netlify Deployment

### 1. Build Settings

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `18`

### 2. Environment Variables

Add in Netlify dashboard:
- `VITE_GEMINI_API_KEY`
- `NODE_ENV=production`

### 3. Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## Heroku Deployment

### 1. Create Heroku App

```bash
# Create app
heroku create your-voice-shopping-app

# Add buildpacks
heroku buildpacks:add heroku/nodejs
```

### 2. Configure Environment

```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set VITE_GEMINI_API_KEY=your_api_key
```

### 3. Deploy

```bash
# Deploy to Heroku
git push heroku main
```

## Production Checklist

### Security

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Input validation in place

### Performance

- [ ] Gzip compression enabled
- [ ] Static assets cached
- [ ] CDN configured
- [ ] Database optimized (if applicable)
- [ ] API response times monitored

### Monitoring

- [ ] Error logging configured
- [ ] Performance monitoring set up
- [ ] Health checks implemented
- [ ] Uptime monitoring active
- [ ] Analytics tracking enabled

### Backup & Recovery

- [ ] Database backups scheduled
- [ ] Disaster recovery plan documented
- [ ] Rollback procedures tested
- [ ] Data retention policies defined

## SSL/TLS Configuration

### Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure nginx
sudo nano /etc/nginx/sites-available/yourdomain.com
```

### Cloudflare SSL

1. Add domain to Cloudflare
2. Update nameservers
3. Enable "Always Use HTTPS"
4. Configure SSL/TLS encryption mode

## Load Balancing

### Nginx Load Balancer

```nginx
upstream backend {
    server backend1:3001;
    server backend2:3001;
    server backend3:3001;
}

server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### AWS Application Load Balancer

```yaml
# AWS ALB configuration
Resources:
  ApplicationLoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Scheme: internet-facing
      Type: application
      SecurityGroups:
        - sg-12345678
      Subnets:
        - subnet-12345678
        - subnet-87654321
```

## Scaling Strategies

### Horizontal Scaling

- Use load balancers
- Implement session management
- Configure auto-scaling groups
- Use container orchestration (Kubernetes)

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Implement caching strategies
- Use CDN for static assets

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Environment Variables**
   ```bash
   # Check environment variables
   echo $VITE_GEMINI_API_KEY
   ```

3. **Port Conflicts**
   ```bash
   # Check port usage
   lsof -i :3000
   lsof -i :3001
   ```

4. **Docker Issues**
   ```bash
   # Clean up Docker
   docker system prune -a
   docker volume prune
   ```

### Logs and Debugging

```bash
# View application logs
npm run dev 2>&1 | tee app.log

# Docker logs
docker-compose logs -f

# Production logs
heroku logs --tail
vercel logs
```

## Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Monitor API usage and costs
- [ ] Review and rotate API keys
- [ ] Backup data regularly
- [ ] Test disaster recovery procedures
- [ ] Update SSL certificates
- [ ] Review security configurations

### Performance Monitoring

```bash
# Monitor application performance
npm run test:coverage

# Check bundle size
npm run build -- --analyze

# Monitor API response times
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3001/api/health"
```

## Support

For deployment issues:
- Check the troubleshooting section
- Review logs and error messages
- Consult platform-specific documentation
- Contact your DevOps team or platform support
