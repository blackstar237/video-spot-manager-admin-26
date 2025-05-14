
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  
  // Form setup with validation
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Handle login submission
  const onSubmit = async (data: LoginFormData) => {
    // Simulate authentication - replace with real authentication later
    if (data.email === "admin@example.com" && data.password === "password123") {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre tableau de bord",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Échec de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-violet-800 to-rose-500 p-4 relative overflow-hidden">
      {/* Overlay pour donner un effet de brillance */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
      
      {/* En-tête avec le nom de l'entreprise */}
      <div className="absolute top-12 w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-blue-600 to-orange-500 inline-block text-transparent bg-clip-text mb-2">
          Digit-Service
        </h1>
        <div className="h-1 w-24 mx-auto rounded bg-gradient-to-r from-pink-500 via-blue-600 to-orange-500"></div>
      </div>
      
      {/* Logo stylisé */}
      <div className="absolute top-32 opacity-10 pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-gradient-to-r from-blue-600 via-teal-400 to-orange-500 animate-pulse blur-xl"></div>
      </div>
      
      <div className="w-full max-w-md z-10">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">Admin</CardTitle>
            <CardDescription className="text-gray-200">
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
                      <FormLabel className="text-gray-200">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="votre@email.com" 
                          {...field} 
                          className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-200" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="pr-10 bg-white/20 border-white/30 text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-200" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full group mt-2 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 border-none"
                  disabled={form.formState.isSubmitting}
                >
                  <LogIn className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                  Se connecter
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-white/10 pt-5">
            <p className="text-sm text-gray-300">
              Portail réservé aux administrateurs
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Effet de lueur en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-purple-500/20 to-transparent"></div>
    </div>
  );
};

export default Login;
