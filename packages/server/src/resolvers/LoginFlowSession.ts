import { PrismaClient } from "@prisma/client";
import { generators } from "openid-client";
import { Service } from "typedi";

type LoginFlowSessionUniqueParam = { id: number } | { uuid: string };

@Service()
export class LoginFlowSessionRepository {
  constructor(private prisma: PrismaClient) {}

  // Finders

  findLoginFlowSessionByUnique(param: LoginFlowSessionUniqueParam) {
    return this.prisma.loginFlowSession.findUnique({ where: param });
  }

  startLoginFlow({
    redirectToAfterLogin,
    sendToken,
    setCookie,
  }: {
    redirectToAfterLogin: string;
    setCookie?: boolean;
    sendToken?: boolean;
  }) {
    return this.prisma.loginFlowSession.create({
      data: {
        redirectToAfterLogin,
        setCookie,
        sendToken,
        codeVerifier: generators.codeVerifier(),
      },
    });
  }

  // Mutators

  async completeLoginFlow(param: LoginFlowSessionUniqueParam) {
    return this.prisma.loginFlowSession.delete({ where: param });
  }
}
