import { useEffect, useState } from "react";
import { useLocation, matchPath, match } from "react-router-dom";

interface UsePathChangeOptions {
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
}

export const usePathChange = <Params extends { [K in keyof Params]?: string }>(
  pattern: string | string[],
  options: UsePathChangeOptions = {}
): match<Params> | null => {
  const location = useLocation();
  const [matchResult, setMatchResult] = useState<match<Params> | null>(null);

  useEffect(() => {
    const matched = matchPath<Params>(location.pathname, {
      path: pattern,
      exact: options.exact || false,
      strict: options.strict || false,
      sensitive: options.sensitive || false,
    });
    setMatchResult(matched);
  }, [
    location.pathname,
    pattern,
    options.exact,
    options.strict,
    options.sensitive,
  ]);

  return matchResult;
};

// const match = usePathChange<{ id: string }>('/product/:id', { exact: true });
