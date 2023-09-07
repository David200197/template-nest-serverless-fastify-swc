import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LazyModuleLoader } from "@nestjs/core";

@Controller("user")
export class UserController {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  private async getUserService() {
    const { UserModule } = await import("./user.module");
    const moduleRef = await this.lazyModuleLoader.load(() => UserModule);

    const { UserService } = await import("./user.service");
    const userService = moduleRef.get(UserService);
    return userService;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userService = await this.getUserService();
    return userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    const userService = await this.getUserService();
    return userService.findAll();
  }

  @Get("sample")
  Sample() {
    return "sample";
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const userService = await this.getUserService();
    return userService.findOne(+id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    const userService = await this.getUserService();
    return userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const userService = await this.getUserService();
    return userService.remove(+id);
  }
}
