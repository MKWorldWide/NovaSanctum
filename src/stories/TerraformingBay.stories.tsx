import type { Meta, StoryObj } from '@storybook/react';
import { TerraformingBay } from '../components/TerraformingBay';

const meta: Meta<typeof TerraformingBay> = {
  title: 'Components/Terraforming Bay',
  component: TerraformingBay,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TerraformingBay>;

export const Default: Story = {
  args: {},
};

export const WithDeployingCanister: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    const deployButton = canvas.querySelector('button');
    if (deployButton) {
      deployButton.click();
    }
  },
};
