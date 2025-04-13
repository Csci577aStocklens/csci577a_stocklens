import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userMessage: string = ''; // Holds the user's input message
  chatMessages: { role: string, content: string }[] = []; // Stores the chat history

  private apiUrl: string = 'https://api.together.xyz/v1/chat/completions'; // API endpoint
  private apiKey: string = 'd7391b364663a3f058dfe4ec68eb9fde99f594f941f23f3e19be1c7f43ca579e'; // API key

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.userMessage.trim()) {
      console.log('User message is empty.'); // Debug log
      return; // Do nothing if the input is empty
    }
  
    console.log('User message:', this.userMessage); // Log the user's input
  
    // Add the user's message to the chat history immediately
    this.chatMessages.push({ role: 'user', content: this.userMessage });
    console.log('Updated chatMessages:', this.chatMessages); // Log the updated chat history
  
    // Prepare the payload for the API request
    const payload = {
      model: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
      messages: this.chatMessages // Send the entire chat history
    };
    console.log('Payload:', payload); // Log the payload being sent to the API
  
    // Set the headers for the API request
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });
  
    // Make the POST request to the API
    this.http.post<any>(this.apiUrl, payload, { headers }).subscribe(
      (response) => {
        console.log('API Response:', response); // Log the API response
        // Add the API's response to the chat history
        const assistantMessage = response.choices[0].message.content;
        this.chatMessages.push({ role: 'assistant', content: assistantMessage });
        console.log('Updated chatMessages after API response:', this.chatMessages); // Log the updated chat history
      },
      (error) => {
        console.error('Error:', error); // Log any errors
      }
    );
  
    // Clear the user's input field
    this.userMessage = '';
  }
}