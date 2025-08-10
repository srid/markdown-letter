{
  description = "Markdown Letter - Convert MDX to self-contained HTML";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      
      perSystem = { config, self', inputs', pkgs, system, ... }: {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.npm
            nodePackages.typescript
            just
          ];

          shellHook = ''
            echo "🚀 Markdown Letter development environment"
            echo "Node.js version: $(node --version)"
            echo ""
            just
          '';
        };
      };
    };
}
