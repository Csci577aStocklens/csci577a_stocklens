import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(content: string): SafeHtml {
    if (!content) {
      return '';
    }

    let formattedContent = content;
    formattedContent = formattedContent.replace(/^###\s*((?:\S+\s+){1,4})/gm, (_match, p1) => {
      return `<span style="font-weight: bold;">${p1.trim()}</span>`;
    });

    formattedContent = formattedContent.replace(/(\d+\.)\s*\*\*\*(.*?)\*\*\*/g, (_match, num, text) => {
      return `<span style="font-weight: bold;">${num} ${text}</span>`;
    });

    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, (_match, text) => {
      return `<span style="font-weight: bold;">${text}</span>`;
    });

    formattedContent = formattedContent.replace(/\n/g, '<br/>');

    return this.sanitizer.bypassSecurityTrustHtml(formattedContent);
  }
}
