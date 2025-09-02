{
  description = "Markdown letter converter using pandoc";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      
      perSystem = { config, self', inputs', pkgs, system, ... }: {
        apps.default = {
          type = "app";
          program = pkgs.lib.getExe (pkgs.writeShellApplication {
            name = "markdown-to-html";
            runtimeInputs = [ pkgs.pandoc ] ++ pkgs.lib.optionals pkgs.stdenv.isLinux [ pkgs.xdg-utils ];
            text = ''
              open_browser=false
              if [[ "$1" == "-b" ]]; then
                open_browser=true
                shift
              fi
              
              base=$(basename "$1" .md)
              pandoc -s -f markdown -t html5 "$1" -c pandoc-style.css > "$base.html"
              
              if [[ "$open_browser" == "true" ]]; then
                if [[ "$OSTYPE" == "darwin"* ]]; then
                  open "$base.html"
                else
                  xdg-open "$base.html"
                fi
              fi
            '';
          });
        };

        checks.test-app = pkgs.runCommand "test-app" {
          buildInputs = [ self'.apps.default.program ];
        } ''
          cp ${./test.md} test.md
          ${self'.apps.default.program} test.md
          
          # Check that HTML file was created
          if [[ ! -f test.html ]]; then
            echo "ERROR: HTML file was not created"
            exit 1
          fi
          
          echo "App test passed!"
          touch $out
        '';
      };
    };
}