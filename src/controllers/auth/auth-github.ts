import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import axios from "axios";
import { prisma } from "../../lib/prisma";
import { env } from "../../variables/env";

export default async function AuthGithubController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const querySchema = z.object({
    code: z.string(),
  });

  const { code } = querySchema.parse(req.query);

  const accessTokenResponse = await axios.post(
    "https://github.com/login/oauth/access_token",
    null,
    {
      params: {
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        Accept: "application/json",
      },
    },
  );

  const { access_token } = accessTokenResponse.data;

  const userResponse = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const userSchema = z.object({
    id: z.number(),
    email: z.string().nullable(),
    name: z.string(),
    avatar_url: z.string().url(),
  });

  const userInfo = userSchema.parse(userResponse.data);

  if (!userInfo.email) {
    const emailsResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const emailSchema = z.array(
      z.object({ email: z.string(), primary: z.boolean() }),
    );
    const emails = emailSchema.parse(emailsResponse.data);
    const primaryEmail = emails.find((email) => email.primary);

    if (primaryEmail) {
      userInfo.email = primaryEmail.email;
    }
  }

  if (!userInfo.email) {
    return res
      .status(400)
      .send({ message: "Could not retrieve email from GitHub" });
  }

  let user = await prisma.user.findUnique({
    where: {
      email: userInfo.email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: userInfo.email,
        name: userInfo.name,
        image: userInfo.avatar_url,
        provider: "GITHUB",
      },
    });
  }

  if (user) {
    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: userInfo.email,
        name: userInfo.name,
        image: userInfo.avatar_url,
        provider: "GITHUB",
      },
    });
  }

  const token = await res.jwtSign(
    {},
    {
      sign: {
        sub: user.id,
        expiresIn: "30d",
      },
    },
  );

  return res
    .setCookie("refreshToken", token, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .redirect(env.HOST_WEB);
}
