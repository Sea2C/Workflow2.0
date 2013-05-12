Vagrant.configure("2") do |config|

  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.network :forwarded_port, guest: 3000, host: 3000, auto_correct: true

  config.vm.provision :chef_solo do |chef|
      chef.cookbooks_path = "chef/cookbooks"
      chef.add_recipe "apt"
      chef.add_recipe "build-essential"
      chef.add_recipe "nodejs"
      chef.add_recipe "git"
      chef.add_recipe "ulimit"
      chef.add_recipe "redisio::install"
      chef.add_recipe "redisio::enable"
      chef.add_recipe "mongodb::10gen_repo"
      chef.add_recipe "mongodb"

      chef.json = {
        "nodejs" => {
          "version" => "0.10.5",
          "install_method" => "source",
          "npm" => "1.2.18"
        }
      }
  end

end