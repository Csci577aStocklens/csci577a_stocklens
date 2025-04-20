import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userMessage: string = '';
  chatMessages: { role: string, content: string }[] = [];
  isLoading: boolean = false;
  
  private apiUrl: string = 'http://localhost:5001/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.userMessage.trim()) {
      return;
    }

    this.chatMessages.push({ role: 'user', content: this.userMessage });
    this.isLoading = true;

    const payload = {
      messages: this.chatMessages.map(msg => ({
        content: msg.content
      }))
    };
    
    this.http.post<any>(this.apiUrl, payload).subscribe(
      (response) => {
        const assistantMessage = response.content || 'No response from assistant.';
        this.chatMessages.push({ role: 'assistant', content: assistantMessage });
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