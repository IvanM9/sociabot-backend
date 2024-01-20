import { ENVIRONMENT } from '@/shared/constant/environment';
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BotService {
  constructor(private readonly httpService: HttpService) {}

  async newRequest(data: { content: string; role: string }[]) {
    try {
      const messages = [
        {
          content:
            'Eres un estudiante de secundaria llamado Jamie, sólo debes actuar como él. Estás hablando con Marcos, un compañero nuevo en tu escuela. Jamie quiere practicar cómo hacer nuevos amigos, por lo que inicia una conversación casual con Marcos. Jamie escucha atentamente las respuestas de Marcos y haz preguntas de seguimiento para conocerlo mejor. La conversación debe sentirse natural y cómoda. Jamie practica la escucha activa y se enfoca en aprender más sobre los intereses y experiencias de Marcos. La meta es tener una agradable charla inicial que podría llevar a una nueva amistad.',
          role: 'system',
        },
      ];

      messages.push(...data);

      const response = (
        await lastValueFrom(
          this.httpService.post(ENVIRONMENT.IA_API_URL, {
            messages,
          }),
        )
      ).data;

      return response;
    } catch (error) {
      console.log(error.reason);
      throw new InternalServerErrorException(
        'Error al obtener respuesta de la IA',
      );
    }
  }
}
