interface APIConfig {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
}

interface RequestOptions extends RequestInit {
  retryOnError?: boolean
}

class SacredAPIService {
  private config: Required<APIConfig>
  private defaultConfig: Required<APIConfig> = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
    retries: 3,
    retryDelay: 1000
  }

  constructor(config: APIConfig = {}) {
    this.config = { ...this.defaultConfig, ...config }
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async fetchWithTimeout(url: string, options: RequestOptions) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  private async retry(fn: () => Promise<Response>, retries: number): Promise<Response> {
    try {
      return await fn()
    } catch (error) {
      if (retries === 0 || !(error instanceof Error) || error.name !== 'AbortError') {
        throw error
      }
      await this.delay(this.config.retryDelay)
      return this.retry(fn, retries - 1)
    }
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`
    const response = await this.retry(
      () => this.fetchWithTimeout(url, { ...options, method: 'GET' }),
      options.retryOnError ? this.config.retries : 0
    )
    return this.handleResponse(response)
  }

  async post<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`
    const response = await this.retry(
      () => this.fetchWithTimeout(url, {
        ...options,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data)
      }),
      options.retryOnError ? this.config.retries : 0
    )
    return this.handleResponse(response)
  }

  async put<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`
    const response = await this.retry(
      () => this.fetchWithTimeout(url, {
        ...options,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data)
      }),
      options.retryOnError ? this.config.retries : 0
    )
    return this.handleResponse(response)
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`
    const response = await this.retry(
      () => this.fetchWithTimeout(url, { ...options, method: 'DELETE' }),
      options.retryOnError ? this.config.retries : 0
    )
    return this.handleResponse(response)
  }
}

// Export both the instance and the class for testing and direct instantiation
export const sacredAPI = new SacredAPIService();
export { SacredAPIService };
