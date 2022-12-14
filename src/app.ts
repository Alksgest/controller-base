import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import { useExpressServer } from "./core";
import {
  Controller,
  Post,
  FromBody,
  Get,
  FromParam,
  UseBefore,
  UseAfter,
  IsString,
  IsNumber,
  Validate,
  IsBoolean,
} from "./decorators";
import { ControllerBaseConfig } from "./types/settings";
import { IExpressMiddleware } from "./types/web";

class TestMiddleware implements IExpressMiddleware {
  use(request: Request, response: Response, next: (err?: any) => any) {
    console.log("Hello from middleware!");

    if (next) {
      next();
    }
  }
}

class TestControllerMiddleware implements IExpressMiddleware {
  use(request: Request, response: Response, next: (err?: any) => any) {
    console.log("Hello from controller middleware!");

    if (next) {
      next();
    }
  }
}

// class TestModel {
//   @IsNumber({ notStrictTypeCheck: true })
//   value1?: string;
//   @IsBoolean()
//   value2?: boolean;
// }


interface TestModel {
  value1?: string;
  value2?: boolean;
}

@UseAfter(TestControllerMiddleware)
@UseBefore(TestControllerMiddleware)
@Controller("/test")
export class TestController {
  @Post()
  testPost(@Validate() @FromBody model: TestModel): TestModel {
    console.log("model: ", model);
    return model;
  }

  // @Get()
  // testGet() {
  //   console.log("test get");
  //   return "TEST GET";
  // }

  // @UseAfter(TestMiddleware)
  // @UseBefore(TestMiddleware)
  // @Get("/byId/:id")
  // testGetWithParam(@FromParam("id") id: string) {
  //   console.log("controller method invoke!");
  //   return Promise.resolve(id);
  // }
}

const config: ControllerBaseConfig = {
  cors: true,
  controllers: [TestController],
};

let app: Express = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

useExpressServer(app, config);

app.listen(8000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${8000}`);
});

//TODO: remove default usage of body parser as middleware
//TODO: add file receiving
//TODO: add decorators for types for swagger
//TODO: add validation decorators such as Min, Max, In, Required etc.
