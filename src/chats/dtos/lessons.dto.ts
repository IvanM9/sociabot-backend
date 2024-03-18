import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AddObservationsDTO {

  @ApiProperty()
  @IsString()
  observations: string;
}
