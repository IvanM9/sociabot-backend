import { ENVIRONMENT } from '@/shared/constant/environment';
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BotService {
  constructor(private readonly httpService: HttpService) {}

  async newRequest(data: { content: string; role: string }[]) {
    try {
      const response = (
        await lastValueFrom(
          this.httpService.post(ENVIRONMENT.IA_API_URL, {
            messages: data,
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
