import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener mínimo 6 caracteres" }, { status: 400 });
    }
    const user = await createUser(name, email, password);
    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error interno" }, { status: 400 });
  }
}
