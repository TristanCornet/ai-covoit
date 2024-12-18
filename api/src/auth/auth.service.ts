import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
    @Inject(JwtService)
    private jwtService: JwtService,
  ) {}

  async signUp(registerDto: RegisterDto) {
    // Regle de validation email
    if (
      !registerDto.email.match(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i)
    ) {
      throw new UnauthorizedException({ message: 'Email invalide' });
    }

    // Check if email is already used
    const user = await this.usersService.findByEmail(registerDto.email);
    if (user) {
      throw new UnauthorizedException({ message: 'Email existant' });
    }

    // Regle de validation password
    if (
      registerDto.password.length < 12 ||
      registerDto.password.match(/[a-z]/g) === null ||
      registerDto.password.match(/[A-Z]/g) === null ||
      registerDto.password.match(/[0-9]/g) === null ||
      registerDto.password.match(/[^a-zA-Z\d]/g) === null
    ) {
      throw new UnauthorizedException({ message: 'Mot de passe faible' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const userDto: CreateUserDto = {
      email: registerDto.email,
      password: hashedPassword,
      firstname: registerDto.firstname,
      lastname: registerDto.lastname,
      image: null,
    };
    return this.usersService.create(userDto);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({ message: 'Email inexistant' });
    }

    // Check hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException({ message: 'Mot de passe incorrect' });
    }

    // Generate JWT
    // TODO : put all necessary data in the payload
    const payload = { id: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
