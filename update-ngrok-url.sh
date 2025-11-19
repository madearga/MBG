#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 MBG Ngrok URL Updater${NC}"
echo "================================="

# Function to validate URL
validate_url() {
    if [[ ! $1 =~ ^https://.*\.ngrok-free\.app$ ]]; then
        echo -e "${RED}❌ Error: Invalid URL format.${NC}"
        echo "URL must start with 'https://' and end with '.ngrok-free.app'"
        return 1
    fi
    return 0
}

# Get URL from argument or prompt
NEW_URL="$1"

if [ -z "$NEW_URL" ]; then
    echo -e "${YELLOW}Enter your new Ngrok URL (e.g., https://xxxx.ngrok-free.app):${NC}"
    read -r NEW_URL
fi

# Validate input
if ! validate_url "$NEW_URL"; then
    exit 1
fi

echo -e "\n${BLUE}📝 Updating configuration files...${NC}"

# Update .env.local
if [ -f ".env.local" ]; then
    # Create backup
    cp .env.local .env.local.bak
    
    # Update NEXT_PUBLIC_SITE_URL
    if grep -q "NEXT_PUBLIC_SITE_URL=" .env.local; then
        sed -i '' "s|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=$NEW_URL|" .env.local
        echo -e "${GREEN}✅ Updated .env.local${NC}"
    else
        echo "NEXT_PUBLIC_SITE_URL=$NEW_URL" >> .env.local
        echo -e "${GREEN}✅ Added to .env.local${NC}"
    fi
else
    echo -e "${RED}❌ .env.local not found!${NC}"
fi

# Update convex/.env
if [ -f "convex/.env" ]; then
    # Create backup
    cp convex/.env convex/.env.bak
    
    # Update NEXT_PUBLIC_SITE_URL
    if grep -q "NEXT_PUBLIC_SITE_URL=" convex/.env; then
        sed -i '' "s|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=$NEW_URL|" convex/.env
        echo -e "${GREEN}✅ Updated convex/.env${NC}"
    else
        echo "NEXT_PUBLIC_SITE_URL=$NEW_URL" >> convex/.env
        echo -e "${GREEN}✅ Added to convex/.env${NC}"
    fi
else
    echo -e "${RED}❌ convex/.env not found!${NC}"
fi

echo -e "\n${BLUE}🔄 Syncing with Convex Cloud...${NC}"
pnpm sync

echo -e "\n${GREEN}🎉 Update Complete!${NC}"
echo "================================="
echo -e "${YELLOW}⚠️  IMPORTANT NEXT STEPS:${NC}"
echo "1. Go to your GitHub OAuth App settings"
echo "2. Update 'Homepage URL' to: ${BLUE}$NEW_URL${NC}"
echo "3. Update 'Authorization callback URL' to: ${BLUE}$NEW_URL/api/auth/callback/github${NC}"
echo "================================="
