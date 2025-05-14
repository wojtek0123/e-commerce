import { Component, signal } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from '@e-commerce/client-web/shared/ui'

@Component({
  selector: 'lib-faq',
  imports: [AccordionComponent, AccordionPanelComponent],
  templateUrl: './faq.component.html',
})
export class FaqComponent {
  items = signal<{ question: string, answer: string }[]>([
    {
      question: 'What types of books do you sell?',
      answer: 'We offer a wide variety of physical books across all genres to suit every reader’s taste.'
    }, {
      question: 'How do I place an order?',
      answer: 'Placing an order is simple! Just browse our collection, add your favorite books to the cart, then proceed to checkout. You will be asked to select your delivery address, choose a delivery method, and select a payment method before confirming your order.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit card payments and payments using a six-digit code.'
    }, {
      question: 'How much does shipping cost and how long does delivery take?',
      answer: 'Shipping is free of charge! Orders are delivered via courier within 1-2 business days.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We follow the standard return policy applicable in Poland. If you wish to return a book, please ensure it meets the conditions outlined by Polish consumer law.'
    }, {
      question: 'Do I need to create an account to shop?',
      answer: 'Yes, creating an account is required to place orders. This helps us process your orders efficiently and keep your information secure.'
    }, {
      question: 'How do you protect my personal data?',
      answer: 'Customer data is securely stored in our database with restricted access to ensure your privacy and safety.'
    }, {
      question: 'How can I contact customer support?',
      answer: 'You can reach us anytime at wojtepietraszuk@gmail.com for any questions or assistance.'
    }, {
      question: 'Do you offer gift wrapping, personalized messages, or loyalty programs?',
      answer: 'Currently, we do not offer gift wrapping, personalized messages, or loyalty programs. Discounts are not fully implemented at this time.',
    }, {
      question: 'Can I pre-order or backorder books?',
      answer: 'At the moment, we do not support pre-orders or backorders. If you want, I can help you format this for your website or expand with additional questions!'
    }
  ])
}
