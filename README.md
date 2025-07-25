# NovaSanctum

A comprehensive quantum gaming and mystical technology platform built with Next.js, TypeScript, and AWS Amplify.

## 🚀 Features

- **Quantum Gaming Dashboard**: Advanced gaming analytics and real-time monitoring
- **Mystical Technology Integration**: Sacred UI components and mystical interfaces
- **AWS Amplify Backend**: Scalable cloud infrastructure
- **Real-time Data Processing**: WebSocket integration for live data streams
- **Comprehensive Testing**: Jest and Storybook integration
- **Automated CI/CD**: GitHub Actions with comprehensive automation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Sacred UI Components
- **Backend**: AWS Amplify, GraphQL
- **Testing**: Jest, React Testing Library, Storybook
- **Automation**: GitHub Actions, Dependabot
- **Deployment**: AWS Amplify Hosting

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/NovaSanctum.git
   cd NovaSanctum
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🤖 GitHub Automation Setup

NovaSanctum includes comprehensive GitHub automation powered by the provided token. The automation suite includes:

### 🔧 Automated Workflows

1. **NovaSanctum Automation Suite** (`.github/workflows/automation-setup.yml`)
   - Daily dependency updates
   - Code quality checks
   - Security scanning
   - Documentation updates
   - Preview deployments

2. **PR Automation & Review** (`.github/workflows/pr-automation.yml`)
   - Automatic PR labeling
   - Code review automation
   - Merge readiness checks
   - Stakeholder notifications

3. **Dependabot Automation** (`.github/workflows/dependabot-automation.yml`)
   - Auto-approval of security updates
   - Dependency health monitoring
   - Automated merging of safe updates

### 🚀 Quick Setup

1. **Run the setup script**
   ```bash
   node scripts/setup-github-automation.js <your-github-token>
   ```

2. **Add repository secrets**
   Go to your repository Settings > Secrets and variables > Actions and add:
   - `NOVASANCTUM_TOKEN`: `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`
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `CODECOV_TOKEN`: Your Codecov token (optional)
   - `SNYK_TOKEN`: Your Snyk token (optional)

3. **Push changes to trigger automation**
   ```bash
   git add .
   git commit -m "feat: add GitHub automation suite"
   git push origin main
   ```

### 📋 Automation Features

- **🔄 Daily Dependency Updates**: Automatically checks for outdated packages
- **🏷️ Smart PR Labeling**: Automatically labels PRs based on content and size
- **🤖 Automated Reviews**: Provides automated code review comments
- **🔒 Security Scanning**: Runs security audits on dependencies
- **📊 Quality Metrics**: Tracks test coverage and code quality
- **🚀 Preview Deployments**: Creates preview environments for PRs
- **🧹 Cleanup**: Automatically cleans up old branches and artifacts

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run Storybook
```bash
npm run storybook
```

## 🏗️ Building

### Development build
```bash
npm run build
```

### Production build
```bash
npm run build
npm start
```

## 📚 Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Integration Summaries](INTEGRATION_SUMMARIES.md)

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Storybook
npm run storybook        # Start Storybook development server
npm run build-storybook  # Build Storybook for production

# Automation
npm run burst:all-dev    # Run all development automation
```

## 🌟 Sacred UI Components

NovaSanctum includes a comprehensive set of mystical UI components:

- **SacredButton**: Enhanced button with mystical animations
- **SacredCard**: Mystical card component with particle effects
- **SacredModal**: Modal with quantum transitions
- **SacredDataGrid**: Advanced data visualization
- **SacredPagination**: Mystical pagination controls
- **SacredToast**: Notification system with mystical styling

## 🔮 Quantum Gaming Features

- **Real-time Analytics**: Live gaming data visualization
- **Quantum State Management**: Advanced state management with mystical properties
- **WebSocket Integration**: Real-time data streaming
- **Performance Monitoring**: Advanced performance tracking
- **User Experience**: Immersive mystical interface design

## 🤝 Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

The automation suite will automatically:
- Label your PR appropriately
- Run code quality checks
- Provide automated review comments
- Create preview deployments
- Notify relevant stakeholders

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Sacred UI**: Mystical component library
- **AWS Amplify**: Cloud infrastructure
- **Next.js**: React framework
- **Tailwind CSS**: Utility-first CSS framework
- **GitHub Actions**: Automation platform

## 🔗 Links

- [Live Demo](https://novasanctum.com)
- [Documentation](https://docs.novasanctum.com)
- [Issues](https://github.com/your-username/NovaSanctum/issues)
- [Discussions](https://github.com/your-username/NovaSanctum/discussions)

---

**NovaSanctum** - Where technology meets mysticism ✨
