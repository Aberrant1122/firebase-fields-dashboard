const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  id: number;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthAPI {
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const ct = response.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      } else {
        const text = await response.text();
        throw new Error(text || 'Signup failed');
      }
    }

    const ct = response.headers.get('content-type') || '';
    const result: AuthResponse = ct.includes('application/json')
      ? await response.json()
      : JSON.parse(await response.text());
    this.setTokens(result.accessToken, result.refreshToken);
    sessionStorage.setItem('user', JSON.stringify(result.user));
    return result;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const ct = response.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      } else {
        const text = await response.text();
        throw new Error(text || 'Login failed');
      }
    }

    const ct = response.headers.get('content-type') || '';
    const result: AuthResponse = ct.includes('application/json')
      ? await response.json()
      : JSON.parse(await response.text());
    this.setTokens(result.accessToken, result.refreshToken);
    sessionStorage.setItem('user', JSON.stringify(result.user));
    return result;
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearTokens();
  }

  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const ct = response.headers.get('content-type') || '';
      const result = ct.includes('application/json')
        ? await response.json()
        : JSON.parse(await response.text());
      sessionStorage.setItem('accessToken', result.accessToken);
      return result.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearTokens();
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const accessToken = this.getAccessToken();
    
    if (!accessToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          // Try to refresh token
          const newToken = await this.refreshAccessToken();
          if (newToken) {
            // Retry with new token
            const retryResponse = await fetch(`${API_URL}/auth/me`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${newToken}`,
              },
            });
            if (retryResponse.ok) {
              const ct = retryResponse.headers.get('content-type') || '';
              const result = ct.includes('application/json')
                ? await retryResponse.json()
                : JSON.parse(await retryResponse.text());
              return result.user;
            }
          }
        }
        return null;
      }

      const ct = response.headers.get('content-type') || '';
      const result = ct.includes('application/json')
        ? await response.json()
        : JSON.parse(await response.text());
      return result.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const authAPI = new AuthAPI();

