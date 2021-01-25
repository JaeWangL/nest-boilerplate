import { BadRequestException, Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import JwtAccessGuard from '@infrastructure/guards/jwt-access.guard';
import {
  SignInCommand,
  SignInSocialCommand,
  SignOutCommand,
  SignUpCommand,
  SignUpSocialCommand,
  TokenRefreshingCommand,
} from '../commands';
import {
  AuthTokensDto,
  SignInRequest,
  SignInSocialRequest,
  SignOutRequest,
  SignUpRequest,
  SignUpSocialRequest,
  TokenRefreshingRequest,
  UserDto,
} from '../dtos';

@ApiTags('Auth')
@Controller('auth')
export default class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('signIn')
  @ApiOperation({ summary: 'SignIn' })
  @ApiResponse({ status: HttpStatus.OK, type: AuthTokensDto, description: 'signed in successfully.' })
  async signIn(@Body() req: SignInRequest): Promise<AuthTokensDto> {
    if (req === undefined) {
      throw new BadRequestException();
    }
    const tokens: AuthTokensDto = await this.commandBus.execute(new SignInCommand(req));

    return tokens;
  }

  @Post('signIn/social')
  @ApiOperation({ summary: 'SignIn with social accounts' })
  @ApiResponse({ status: HttpStatus.OK, type: AuthTokensDto, description: 'signed in successfully.' })
  async signInSocial(@Body() req: SignInSocialRequest): Promise<AuthTokensDto> {
    if (req === undefined) {
      throw new BadRequestException();
    }
    const tokens: AuthTokensDto = await this.commandBus.execute(new SignInSocialCommand(req));

    return tokens;
  }

  @Post('signOut')
  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: 'SignOut' })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean, description: 'signed out successfully.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  async signOut(@Body() req: SignOutRequest): Promise<boolean> {
    if (req === undefined) {
      throw new BadRequestException();
    }
    const result: boolean = await this.commandBus.execute(new SignOutCommand(req));

    return result;
  }

  @Post('signUp')
  @ApiOperation({ summary: 'SignUp' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto, description: 'User Created.' })
  async signUp(@Body() req: SignUpRequest): Promise<UserDto> {
    if (req === undefined) {
      throw new BadRequestException();
    }
    const user: UserDto = await this.commandBus.execute(new SignUpCommand(req));

    return user;
  }

  @Post('signUp/social')
  @ApiOperation({ summary: 'SignUp with social account' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto, description: 'User Created.' })
  async signUpSocial(@Body() req: SignUpSocialRequest): Promise<UserDto> {
    if (req === undefined) {
      throw new BadRequestException();
    }
    const user: UserDto = await this.commandBus.execute(new SignUpSocialCommand(req));

    return user;
  }

  @Post('token/refreshing')
  @ApiOperation({ summary: 'Token Refreshing' })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean, description: 'New access token is successfully generated.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  async tokenRefreshing(@Body() req: TokenRefreshingRequest): Promise<AuthTokensDto> {
    if (req === undefined) {
      throw new BadRequestException();
    }
    const tokens: AuthTokensDto = await this.commandBus.execute(new TokenRefreshingCommand(req));

    return tokens;
  }
}
