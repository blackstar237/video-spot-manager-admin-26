import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Validation schema for login form
const loginSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});
type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form setup with validation
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Handle login submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("Erreur de connexion:", error);
        toast({
          title: "Échec de connexion",
          description: error.message || "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        return;
      }
      
      if (authData.session) {
        toast({ title: "Connexion réussie", description: "Bienvenue sur votre tableau de bord" });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Erreur inattendue:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient corners */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900 via-violet-800 to-rose-500 rounded-br-full opacity-80 -translate-x-1/4 -translate-y-1/4" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-900 via-violet-800 to-rose-500 rounded-tl-full opacity-80 translate-x-1/4 translate-y-1/4" />
      <div className="fixed top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-800 to-pink-600 rounded-bl-full opacity-60 translate-x-1/4 -translate-y-1/4" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-800 to-pink-600 rounded-tr-full opacity-60 -translate-x-1/4 translate-y-1/4" />

      {/* Light overlay to improve content visibility */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />

      {/* En-tête avec le nom de l'entreprise */}
      <div className="absolute top-12 w-full text-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-blue-600 to-orange-500 inline-block text-transparent bg-clip-text mb-2">
          Digit-Service
        </h1>
        <div className="h-1 w-24 mx-auto rounded bg-gradient-to-r from-pink-500 via-blue-600 to-orange-500" />
      </div>

      <div className="w-full max-w-md z-10">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">Admin</CardTitle>
            <CardDescription className="text-gray-300">
              Connectez-vous pour accéder au tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="votre@email.com"
                          className="bg-gray-800 text-white placeholder-gray-400"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="pr-10 bg-gray-800 text-white placeholder-gray-400"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full group mt-2 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 border-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion en cours...
                    </span>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                      Se connecter
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-700 pt-5">
            <p className="text-sm text-gray-400">Portail réservé aux administrateurs</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
