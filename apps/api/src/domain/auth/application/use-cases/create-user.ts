import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../../../core/either';
import { User } from '../../enterprise/entities/user';
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { CpfAlreadyInUseError } from './errors/cpf-already-in-use-error';

interface CreateUserUseCaseRequest {
  email: string;
  password: string;
  name: string;
  accountType?: string;
  phone?: string;
  cpf?: string;
}

type CreateUserUseCaseResponse = Either<
  UserAlreadyExistsError | CpfAlreadyInUseError,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    private userRepository: UsersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    email,
    password,
    name,
    accountType,
    phone,
    cpf,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      return left(new UserAlreadyExistsError());
    }

    if (cpf) {
      const cpfExists = await this.userRepository.findByCpf(cpf);

      if (cpfExists) {
        return left(new CpfAlreadyInUseError());
      }
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      email,
      password: hashedPassword,
      name,
      accountType,
      phone,
      cpf,
    });

    await this.userRepository.create(user);

    return right({ user });
  }
}
