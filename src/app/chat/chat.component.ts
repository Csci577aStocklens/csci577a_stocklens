import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  userMessage: string = '';
  chatMessages: { role: string, content: string }[] = [];
  isLoading: boolean = false;
  userEmail: string = '';

  private apiUrl: string = 'http://localhost:5001/api/chat';
  private currentUserApiUrl: string = 'http://localhost:5001/api/current-user';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.http.get<any>(this.currentUserApiUrl, { withCredentials: true }).subscribe(
      (response) => {
        this.userEmail = response.user?.email || '';
        console.log('Current user email:', this.userEmail);
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) {
      return;
    }

    this.chatMessages.push({ role: 'user', content: this.userMessage });
    this.isLoading = true;

    const payload = {
      email: this.userEmail,
      messages: this.chatMessages.map(msg => ({
        content: msg.content
      }))
    };

    this.http.post<any>(this.apiUrl, payload).subscribe(
      (response) => {
        const assistantMessage = response.content || 'No response from assistant.';
        this.chatMessages.push({ role: 'assistant', content: assistantMessage });

        if (response.stockMatches && response.stockMatches.length > 0) {
          console.log('Stock matches:', response.stockMatches);
        }

        this.isLoading = false;
      },
      (error) => {
        console.error('API Error:', error);
        this.chatMessages.push({ role: 'assistant', content: 'Error: Failed to get response from server.' });
        this.isLoading = false;
      }
    );

    this.userMessage = '';
  }
}