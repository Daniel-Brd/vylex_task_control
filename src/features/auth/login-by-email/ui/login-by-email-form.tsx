import { Button, Input, Label } from '@/shared/ui';

export function LoginByEmailForm() {
  return (
    <form
      onSubmit={() => {
        console.log('submited');
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@example.com.br" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" required />
        </div>
        <div className="flex flex-col gap-3">
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        Não possui uma conta?{' '}
        <a href="#" className="underline underline-offset-4">
          Cadastrar
        </a>
      </div>
    </form>
  );
}
