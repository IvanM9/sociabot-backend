import { ENVIRONMENT } from '@/shared/constant/environment';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
const { GoogleGenerativeAI } = require('@google/generative-ai');

@Injectable()
export class BotService {
  constructor(private readonly httpService: HttpService) {}

  async newRequest(
    data: { parts: string; role: string }[],
    message: string,
    type: string,
  ) {
    const genAI = new GoogleGenerativeAI(ENVIRONMENT.API_KEY_AI);
    const model = genAI.getGenerativeModel({ model: ENVIRONMENT.IA_MODEL });
    try {
      if (type == 'message') {
        data.pop();
      }
      const chat = model.startChat({
        history: data,
        generationConfig: {
          maxOutputTokens: ENVIRONMENT.MAX_OUTPUT_TOKENS,
        },
      });
      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al obtener respuesta de la IA',
      );
    }
  }
}
