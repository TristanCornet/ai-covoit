import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'Inscription réussie' })
  @ApiForbiddenResponse({
    description:
      'Email invalide | Email existant | Mot de passe trop court | Mot de passe sans minuscule | Mot de passe sans majuscule | Mot de passe sans chiffre',
  })
  async create(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.signUp(registerDto);
    } catch (error) {
      if (error.message === 'Email existant') {
        throw new HttpException('Email existant', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Erreur interne du serveur',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Authentification réussie' })
  @ApiForbiddenResponse({
    description: 'Email inexistant | Mot de passe incorrect',
  })
  async signIn(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.signIn(loginDto.email, loginDto.password);
    } catch (error) {
      if (
        error.message === 'Email inexistant' ||
        error.message === 'Mot de passe incorrect'
      ) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Erreur interne du serveur',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
