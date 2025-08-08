import { useLogout as useLogoutMutation } from '@/shared/hooks/use-auth';

export const useLogout = () => {
    const logoutMutation = useLogoutMutation();

    const logout = () => {
        logoutMutation.mutate();
    };

    return {
        logout,
        isLoading: logoutMutation.isPending,
    };
};
