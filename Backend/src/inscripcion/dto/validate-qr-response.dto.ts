export class ValidateQrResponseDto {
  valid: boolean;
  message: string;
  participante?: {
    fullName: string;
    email: string;
  };
  evento?: {
    titulo: string;
    fecha: string;
  };
  estado?: string;
  fechaIngreso?: string;
}

